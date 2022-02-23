import path from 'node:path';
// eslint-disable-next-line camelcase
import {__fetch_polyfill} from '@sveltejs/kit/install-fetch';
import {getRequest, setResponse} from '@sveltejs/kit/node';
import compression from 'compression';
import {manifest} from 'MANIFEST';
import polka from 'polka';
import sirv from 'sirv';
import {Server} from 'SERVER';

__fetch_polyfill();

const app = new Server(manifest);

// eslint-disable-next-line unicorn/prefer-module
const staticServe = sirv(path.join(__dirname, 'storage'), {
  etag: true,
  maxAge: 0,
  immutable: false,
  gzip: true,
  brotli: true,
});

/** @type {import('polka').Middleware} */
function createKitMiddleware() {
  return async (request_, response) => {
    let request;

    try {
      request = await getRequest(getBase(request_.headers), request_);
    } catch (error) {
      response.statusCode = error.status || 400;
      return response.end(error.reason || 'Invalid request body');
    }

    setResponse(response, await app.respond(request));
  };
}

/**
 * @param {import('http').IncomingHttpHeaders} headers
 * @returns
 */
function getBase(headers) {
  const protocol = 'https';
  const host = headers.host;
  return `${protocol}://${host}`;
}

const kitMiddleware = createKitMiddleware();

const server = polka()
  .use(staticServe)
  .use(compression({threshold: 0}), kitMiddleware);

const port = process.env.PORT || 8080;
const listenOptions = {port};

server.listen(listenOptions, () => {
  console.log(`Listening on ${port}`);
});

export {server};
