/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable node/no-missing-import */
/* eslint-disable import/no-unresolved */
import path from "node:path";
import process from "node:process";
import { installPolyfills } from "@sveltejs/kit/node/polyfills";
import { getRequest, setResponse } from "@sveltejs/kit/node";
import { manifest } from "MANIFEST";
import polka from "polka";
import sirv from "sirv";
import { Server } from "SERVER";

// eslint-disable-next-line no-undef
const dir = __dirname;

async function setupCloudLogging() {
  const bunyan = await import("bunyan");
  const { LoggingBunyan } = await import("@google-cloud/logging-bunyan");

  const loggingBunyan = new LoggingBunyan();
  const logger = bunyan.createLogger({
    name: process.env.GAE_SERVICE || "local",
    streams: [
      // Log to Cloud Logging, logging at 'info' and above
      loggingBunyan.stream("info"),
    ],
  });

  // Overwrite console to send log messages to cloud logging instead
  console.log = (...args) => logger.info.call(logger, ...args);
  console.info = (...args) => logger.info.call(logger, ...args);
  console.warn = (...args) => logger.warn.call(logger, ...args);
  console.error = (...args) => logger.error.call(logger, ...args);
  console.debug = (...args) => logger.debug.call(logger, ...args);
}

/** @type {import('polka').Middleware} */
let tracerMiddleware = (_, __, next) => next();

async function setupCloudTracing() {
  const { start } = await import("@google-cloud/trace-agent");

  const tracer = start();

  /** @type {import('polka').Middleware} */
  tracerMiddleware = async (request, response, next) => {
    const traceOptions = {
      name: request.path,
      url: request.originalUrl,
      method: request.method,
      traceContext: tracer.propagation.extract((key) => request.headers[key]),
      skipFrames: 1,
    };

    tracer.runInRootSpan(traceOptions, async (rootSpan) => {
      // Set response trace context.
      const responseTraceContext = tracer.getResponseTraceContext(
        traceOptions.traceContext,
        tracer.isRealSpan(rootSpan),
      );

      if (responseTraceContext) {
        tracer.propagation.inject(
          (k, v) => response.setHeader(k, v),
          responseTraceContext,
        );
      }

      if (!tracer.isRealSpan(rootSpan)) {
        next();
        return;
      }

      tracer.wrapEmitter(request);
      tracer.wrapEmitter(response);

      const url = `${request.protocol}://${request.headers.host}${request.originalUrl}`;
      rootSpan.addLabel(tracer.labels.HTTP_METHOD_LABEL_KEY, request.method);
      rootSpan.addLabel(tracer.labels.HTTP_URL_LABEL_KEY, url);
      rootSpan.addLabel(tracer.labels.HTTP_SOURCE_IP, request.ip);

      // Wrap end
      const originalEnd = response.end;
      response.end = function (cb) {
        response.end = originalEnd;

        const returned = response.end.apply(cb);

        if (request.route && request.route.path) {
          rootSpan.addLabel("express/request.route.path", request.route.path);
        }

        rootSpan.addLabel(
          tracer.labels.HTTP_RESPONSE_CODE_LABEL_KEY,
          response.statusCode,
        );
        rootSpan.endSpan();
        return returned;
      };

      next();
    });
  };
}

installPolyfills();

const server = new Server(manifest);

const staticServe = sirv(path.join(dir, "storage"), {
  etag: true,
  maxAge: 0,
  immutable: false,
  gzip: true,
  brotli: true,
});

/**
 * @param {import('http').IncomingHttpHeaders} headers
 * @returns
 */
function getBase(headers) {
  const { host } = headers;
  const isLocalhost = host.split(":")[0] === "localhost";
  const protocol =
    headers["x-forwarded-proto"] || (isLocalhost ? "http" : "https");
  return `${protocol}://${host}`;
}

/** @type {import('polka').Middleware} */
const ssr = async (request_, response) => {
  /** @type {Request} */
  let request;

  try {
    request = await getRequest({
      base: getBase(request_.headers),
      request: request_,
    });
  } catch (error) {
    response.statusCode = error.status || 400;
    response.end(error.reason || "Invalid request body");
    return;
  }

  setResponse(
    response,
    await server.respond(request, {
      getClientAddress() {
        return request.headers.get("x-forwarded-for");
      },
    }),
  );
};

/** @type {import('polka').Middleware} */
function handleAh(_request, response) {
  response.statusCode = 200;
  response.end("OK");
}

(async () => {
  // eslint-disable-next-line no-undef
  if (USE_CLOUD_LOGGING) {
    await setupCloudLogging();
  }

  // eslint-disable-next-line no-undef
  if (USE_CLOUD_TRACING) {
    await setupCloudTracing();
  }

  const polkaServer = polka()
    .get("/_ah/start", handleAh)
    .use(tracerMiddleware)
    .use(staticServe)
    .use(ssr);

  const port = process.env.PORT || 8080;
  const listenOptions = { port };

  server.init({ env: process.env }).then(() => {
    polkaServer.listen(listenOptions, () => {
      console.log(`Listening on ${port}`);
    });
  });
})();
