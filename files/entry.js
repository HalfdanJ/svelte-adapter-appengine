import polka from 'polka';
import compression from 'compression';
import {getRawBody} from '@sveltejs/kit/node';
import {init, render} from '../output/server/app.js';

function createKitMiddleware({render}) {
  return async (request, response) => {
    let parsed;
    try {
      parsed = new URL(request.url || '', 'http://localhost');
    } catch {
      response.statusCode = 400;
      return response.end('Invalid URL');
    }

    let body;

    try {
      body = await getRawBody(request);
    } catch (error) {
      response.statusCode = error.status || 400;
      return response.end(error.reason || 'Invalid request body');
    }

    const rendered = await render({
      method: request.method,
      headers: request.headers,
      path: parsed.pathname,
      query: parsed.searchParams,
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

init();
const kitMiddleware = createKitMiddleware({render});

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
