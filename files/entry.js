import path from 'node:path';
import process from 'node:process';
import {installPolyfills} from '@sveltejs/kit/node/polyfills';
import {getRequest, setResponse} from '@sveltejs/kit/node';
import {manifest} from 'MANIFEST';
import polka from 'polka';
import sirv from 'sirv';
import {Server} from 'SERVER';
import {start as startTrace} from '@google-cloud/trace-agent';

async function setupCloudLogging() {
  const bunyan = await import('bunyan');
  const {LoggingBunyan} = await import('@google-cloud/logging-bunyan');

  const loggingBunyan = new LoggingBunyan();
  const logger = bunyan.createLogger({
    name: process.env.GAE_SERVICE || 'local',
    streams: [
      // Log to Cloud Logging, logging at 'info' and above
      loggingBunyan.stream('info'),
    ],
  });

  // Overwrite console to send log messages to cloud logging instead
  console.log = (...args) => logger.info.call(logger, ...args);
  console.info = (...args) => logger.info.call(logger, ...args);
  console.warn = (...args) => logger.warn.call(logger, ...args);
  console.error = (...args) => logger.error.call(logger, ...args);
  console.debug = (...args) => logger.debug.call(logger, ...args);
}

// eslint-disable-next-line no-undef
if (USE_CLOUD_LOGGING) {
  setupCloudLogging();
}

installPolyfills();

const tracer = startTrace();

const server = new Server(manifest);

// eslint-disable-next-line unicorn/prefer-module
const staticServe = sirv(path.join(__dirname, 'storage'), {
  etag: true,
  maxAge: 0,
  immutable: false,
  gzip: true,
  brotli: true,
});

/** @type {import('polka').Middleware} */
const ssr = async (request_, response, next) => {
  const traceOptions = {
    name: request_.path,
    url: request_.originalUrl,
    method: request_.method,
    traceContext: tracer.propagation.extract(key => request_.headers[key]),
    skipFrames: 1,
  };

  tracer.runInRootSpan(traceOptions, async rootSpan => {
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
      return next();
    }

    const url = `${request_.headers['X-Forwarded-Proto'] || 'http'}://${
      request_.headers.host
    }${request_.originalUrl}`;

    // We use the path part of the url as the span name and add the full
    // url as a label
    rootSpan.addLabel(tracer.labels.HTTP_METHOD_LABEL_KEY, request_.method);
    rootSpan.addLabel(tracer.labels.HTTP_URL_LABEL_KEY, url);
    rootSpan.addLabel(tracer.labels.HTTP_SOURCE_IP, request_.connection.remoteAddress);

    /** @type {Request} */
    let request;

    try {
      request = await getRequest(
        {base: getBase(request_.headers), request: request_});
    } catch (error) {
      response.statusCode = error.status || 400;
      response.end(error.reason || 'Invalid request body');

      rootSpan.addLabel('connect/request.route.path', request.originalUrl);
      rootSpan.addLabel(tracer.labels.HTTP_RESPONSE_CODE_LABEL_KEY, response.statusCode);
      rootSpan.endSpan();
      return;
    }

    setResponse(response, await server.respond(request, {
      getClientAddress() {
        return request.headers.get('x-forwarded-for');
      },
    }));

    rootSpan.addLabel('connect/request.route.path', request.originalUrl);
    rootSpan.addLabel(tracer.labels.HTTP_RESPONSE_CODE_LABEL_KEY, response.statusCode);
    rootSpan.endSpan();
  });
};

/**
 * @param {import('http').IncomingHttpHeaders} headers
 * @returns
 */
function getBase(headers) {
  const host = headers.host;
  const isLocalhost = host.split(':')[0] === 'localhost';
  const protocol = headers['x-forwarded-proto'] || (isLocalhost ? 'http' : 'https');
  return `${protocol}://${host}`;
}

/** @type {import('polka').Middleware} */
function handleAh(_request, response) {
  response.statusCode = 200;
  response.end('OK');
}

const polkaServer = polka()
  .get('/_ah/start', handleAh)
  .use(staticServe)
  .use(ssr);

const port = process.env.PORT || 8080;
const listenOptions = {port};

server.init({env: process.env}).then(() => {
  polkaServer.listen(listenOptions, () => {
    console.log(`Listening on ${port}`);
  });
});

export {polkaServer as server};
