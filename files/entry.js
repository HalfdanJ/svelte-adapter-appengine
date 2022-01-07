import polka from 'polka';
import compression from 'compression';
import {getRawBody} from '@sveltejs/kit/node';
// eslint-disable-next-line camelcase
import {__fetch_polyfill} from '@sveltejs/kit/install-fetch';
import {App} from 'APP';
import {manifest} from './manifest.js';

__fetch_polyfill();

const app = new App(manifest);

function createKitMiddleware() {
  return async (request, response) => {
    let body;

    try {
      body = await getRawBody(request);
    } catch (error) {
      response.statusCode = error.status || 400;
      return response.end(error.reason || 'Invalid request body');
    }

    const rendered = await app.render({
      url: request.url,
      method: request.method,
      headers: request.headers,
      rawBody: body,
    });

    if (rendered) {
      response.writeHead(rendered.status, rendered.headers);
      if (rendered.body) {
        response.write(rendered.body);
      }

      response.end();
    } else {
      response.statusCode = 404;
      response.end('Not found');
    }
  };
}

const kitMiddleware = createKitMiddleware();

const server = polka().use(
  compression({threshold: 0}),
  kitMiddleware,
);

const port = process.env.PORT || 8080;
const listenOptions = {port};

server.listen(listenOptions, () => {
  console.log(`Listening on ${port}`);
});

export {server};
