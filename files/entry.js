import polka from 'polka';
import compression from 'compression';
// import {kitMiddleware} from './middlewares.js';
import { getRawBody } from '@sveltejs/kit/node';
import { init, render } from '../output/server/app.js';


function create_kit_middleware({ render }) {
	return async (req, res) => {
		let parsed;
		try {
			parsed = new URL(req.url || '', 'http://localhost');
		} catch (e) {
			res.statusCode = 400;
			return res.end('Invalid URL');
		}

		let body;

		try {
			body = await getRawBody(req);
		} catch (err) {
			res.statusCode = err.status || 400;
			return res.end(err.reason || 'Invalid request body');
		}

		const rendered = await render({
			method: req.method,
			headers: req.headers, // TODO: what about repeated headers, i.e. string[]
			path: parsed.pathname,
			query: parsed.searchParams,
			rawBody: body
		});

		if (rendered) {
			res.writeHead(rendered.status, rendered.headers);
			if (rendered.body) {
				res.write(rendered.body);
			}
			res.end();
		} else {
			res.statusCode = 404;
			res.end('Not found');
		}
	};
}

	init();
const kitMiddleware = create_kit_middleware({ render });


const server = polka().use(
  compression({ threshold: 0 }),
	kitMiddleware,
);

const port = process.env.PORT || 8080;
const listenOpts = { port };

server.listen(listenOpts, () => {
	console.log(`Listening on ${port}`);
});

module.exports = server;
