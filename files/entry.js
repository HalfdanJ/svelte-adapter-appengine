import polka from 'polka';
import compression from 'compression';
import {getRequest, setResponse} from '@sveltejs/kit/node';
// eslint-disable-next-line camelcase
import {__fetch_polyfill} from '@sveltejs/kit/install-fetch';
import {App} from 'APP';
import {manifest} from './manifest.js';

__fetch_polyfill();

const app = new App(manifest);

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

    setResponse(response, await app.render(request));
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

const server = polka().use(compression({threshold: 0}), kitMiddleware);

const port = process.env.PORT || 8080;
const listenOptions = {port};

server.listen(listenOptions, () => {
  console.log(`Listening on ${port}`);
});

export {server};
