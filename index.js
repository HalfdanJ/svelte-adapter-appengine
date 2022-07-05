import {writeFileSync, existsSync, readFileSync} from 'node:fs';
import {join, posix} from 'node:path';
import {fileURLToPath} from 'node:url';
import YAML from 'yaml';
import esbuild from 'esbuild';

const files = fileURLToPath(new URL('./files', import.meta.url));

/** @type {import('.')} **/
export default function entrypoint(options = {}) {
  const {out = 'build'} = options;

  return {
    name: 'appengine',

    async adapt(builder) {
      const temporary = builder.getBuildDirectory('svelte-adapter-appengine');

      builder.rimraf(out);
      builder.rimraf(temporary);

      builder.log.minor('Copying assets');
      builder.writeClient(`${out}/storage`);
      builder.writeStatic(`${out}/storage`);
      builder.writePrerendered(`${out}/storage`);

      const relativePath = posix.relative(temporary, builder.getServerDirectory());

      // Copy server handler
      builder.copy(files, temporary, {replace: {
        SERVER: `${relativePath}/index.js`,
        MANIFEST: './manifest.js',
      }});

      writeFileSync(
        `${temporary}/manifest.js`,
        `export const manifest = ${builder.generateManifest({
          relativePath,
        })};\n`,
      );

      await esbuild.build({
        entryPoints: [`${temporary}/entry.js`],
        outfile: `${out}/index.js`,
        target: 'node16',
        bundle: true,
        platform: 'node',
        format: 'cjs',
        sourcemap: 'linked',
        external: [],
      });

      writeFileSync(`${out}/package.json`, JSON.stringify({type: 'commonjs'}));

      const prerenderedPages = Array.from(builder.prerendered.pages, ([src, page]) => ({
        url: src + '/?$',
        // eslint-disable-next-line camelcase
        static_files: 'storage/' + page.file,
        upload: 'storage/' + page.file,
      }));

      const prerenderedRedirects = Array.from(builder.prerendered.redirects, ([src, _]) => ({
        url: src,
        secure: 'always',
        script: 'auto',
      }));

      // Load existing app.yaml if it exists
      let yaml = {};
      if (existsSync('app.yaml')) {
        builder.log.minor('Existing app.yaml found');
        yaml = YAML.parse(readFileSync('app.yaml').toString());
      }

      const serverRoutes = [
        ...yaml.handlers ?? [],
        ...prerenderedPages,
        ...prerenderedRedirects,
        {
          url: `/${builder.config.kit.appDir}/immutable/`,
          // eslint-disable-next-line camelcase
          static_dir: `storage/${builder.config.kit.appDir}/immutable`,
          expiration: '30d 0h',
        },
        {
          url: `/${builder.config.kit.appDir}/`,
          // eslint-disable-next-line camelcase
          static_dir: `storage/${builder.config.kit.appDir}`,
        },
        {
          url: '/.*',
          secure: 'always',
          script: 'auto',
        },
      ];

      if (serverRoutes.length > 99) {
        throw new Error('Too many url routes: ' + serverRoutes.length);
      }

      writeFileSync(
        join(out, 'app.yaml'),
        YAML.stringify({
          ...yaml,
          runtime: 'nodejs16',
          entrypoint: 'node index.js',
          handlers: serverRoutes,
        }),
      );

      builder.log.success(`To deploy, run "gcloud app deploy --project <CLOUD_PROJECT_ID> ${out}/app.yaml"`);
    },
  };
}
