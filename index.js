import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';
import YAML from 'yaml';
import glob from 'glob-promise';

/**
 * @typedef {import('esbuild').BuildOptions} BuildOptions
 */

/** @type {import('.')} **/
export default function entrypoint(options) {
	return {
		name: 'appengine',

		async adapt({utils}) {
			const dir = '.appengine_build_output';
			utils.rimraf(dir);

			const files = fileURLToPath(new URL('./files', import.meta.url));

			const dirs = {
				static: join(dir, 'static'),
				client: join(dir, 'client'),
				tmp: '.svelte-kit/appengine/',
			};

			utils.log.minor('Generating nodejs entrypoint...');
			utils.rimraf(dirs.tmp);
			utils.copy(join(files, 'entry.js'), '.svelte-kit/appengine/entry.js');

			/** @type {BuildOptions} */
			const defaultOptions = {
				entryPoints: [join(dirs.tmp, 'entry.js')],
				outfile: join(dir, 'index.js'),
				bundle: true,
				inject: [join(files, 'shims.js')],
				platform: 'node',
				target: 'node16',
			};

			const buildOptions = options && options.esbuild
				? await options.esbuild(defaultOptions) : defaultOptions;

			await esbuild.build(buildOptions);

			utils.log.minor('Writing package.json...');
			writeFileSync(
				join(dir, 'package.json'),
				JSON.stringify({
					type: 'commonjs',
				}),
			);

			utils.log.minor('Prerendering static pages...');
			await utils.prerender({
				dest: dirs.static,
			});

			utils.log.minor('Copying assets...');
			utils.copy_static_files(dirs.static);
			utils.copy_client_files(dirs.client);

			utils.log.minor('Writing app.yaml...');

			const staticFiles = await glob('**/*.*', {cwd: dirs.static});
			utils.log.minor('Creating routes for static files' + staticFiles.join(', '));

			const staticFilesRoutes = staticFiles.map(f => ({
				// Remove index.html from url
				url: '/' + f.replace(/index\.html$/gi, ''),
				// eslint-disable-next-line camelcase
				static_files: join('static', f),
				upload: join('static', f),
			}));

			writeFileSync(
				join(dir, 'app.yaml'),
				YAML.stringify({
					runtime: 'nodejs16',
					entrypoint: 'node index.js',
					handlers: [
						{
							url: '/_app',
							// eslint-disable-next-line camelcase
							static_dir: 'client/_app',
						},
						...staticFilesRoutes,
						{
							url: '/.*',
							secure: 'always',
							script: 'auto',
						},
					],
				}),
			);

			utils.log.success('To deploy, run "gcloud app deploy --project <CLOUD_PROJECT_ID> .appengine_build_output/app.yaml"');
		},
	};
}
