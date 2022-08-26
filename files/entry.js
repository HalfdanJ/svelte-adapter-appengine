import path from 'node:path';
import {installPolyfills} from '@sveltejs/kit/node/polyfills';
import {getRequest, setResponse} from '@sveltejs/kit/node';
import {manifest} from 'MANIFEST';
import polka from 'polka';
import sirv from 'sirv';
import {Server} from 'SERVER';

installPolyfills();

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
const ssr = async (request_, response) => {
  let request;

  try {
    request = await getRequest(getBase(request_.headers), request_);
  } catch (error) {
    response.statusCode = error.status || 400;
    return response.end(error.reason || 'Invalid request body');
  }

  setResponse(response, await server.respond(request, {
    getClientAddress() {
      return request.headers.get('x-forwarded-for');
    },
  }));
};

/**
 * @param {import('http').IncomingHttpHeaders} headers
 * @returns
 */
function getBase(headers) {
  const protocol = 'https';
  const host = headers.host;
  return `${protocol}://${host}`;
}

const polkaServer = polka()
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
