import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join, posix} from 'node:path';

import {fileURLToPath} from 'node:url';
import YAML from 'yaml';
import esbuild from 'esbuild';

const files = fileURLToPath(new URL('files', import.meta.url));

/** @type {import('.').default} **/
export default function entrypoint(options = {}) {
  const {out = 'build', external = [], useCloudLogging = false, useCloudTracing = false, dependencies = {}, nodejsRuntime = 16} = options;

  return {
    name: 'svelte-adapter-appengine',

    async adapt(builder) {
      const temporary = builder.getBuildDirectory('svelte-adapter-appengine');

      builder.rimraf(out);
      builder.rimraf(temporary);

      builder.log.minor('Copying assets');
      builder.writePrerendered(`${out}/storage${builder.config.kit.paths.base}`);
      const clientFiles = builder.writeClient(`${out}/storage${builder.config.kit.paths.base}`);

      const relativePath = posix.relative(temporary, builder.getServerDirectory());

      // Copy server handler
      builder.copy(files, temporary, {replace: {
        SERVER: `${relativePath}/index.js`,
        MANIFEST: './manifest.js',
        USE_CLOUD_LOGGING: useCloudLogging,
        USE_CLOUD_TRACING: useCloudTracing,
      }});

      writeFileSync(
        `${temporary}/manifest.js`,
        `export const manifest = ${builder.generateManifest({
          relativePath,
        })};\n`,
      );

      // Add dependencies for logging and tracing
      external.push('@google-cloud/trace-agent', '@google-cloud/logging-bunyan', 'bunyan');
      if (useCloudTracing) {
        dependencies['@google-cloud/trace-agent'] = '^7.0.0';
      }

      if (useCloudLogging) {
        dependencies['@google-cloud/logging-bunyan'] = '^4.0.0';
        dependencies.bunyan = '^1.8.0';
      }

      await esbuild.build({
        entryPoints: [`${temporary}/entry.js`],
        outfile: `${out}/index.js`,
        target: `node${nodejsRuntime}`,
        bundle: true,
        platform: 'node',
        format: 'cjs',
        sourcemap: 'linked',
        external,
      });

      writeFileSync(`${out}/package.json`, JSON.stringify({
        type: 'commonjs',
        dependencies,
      }, null, 2));

      const prerenderedPages = Array.from(builder.prerendered.pages, ([src, page]) => ({
        url: src + '/?$',
        // eslint-disable-next-line camelcase
        static_files: join('storage', page.file).replaceAll('\\', '/'),
        upload: join('storage', page.file).replaceAll('\\', '/'),
        secure: 'always',
      }));

      const prerenderedAssets = Array.from(builder.prerendered.assets, ([path, {type}]) => ({
        url: path,
        // eslint-disable-next-line camelcase
        static_files: join('storage', path).replaceAll('\\', '/'),
        upload: join('storage', path).replaceAll('\\', '/'),
        secure: 'always',
        // eslint-disable-next-line camelcase
        mime_type: type,
      }));

      const prerenderedRedirects = Array.from(builder.prerendered.redirects, ([src, _]) => ({
        url: src,
        secure: 'always',
        script: 'auto',
      }));

      // Add yaml entries for all files outside _app directory, such as favicons
      const additionalClientAssets = clientFiles
        .filter(file => !file.startsWith('_app/'))
        .map(file => ({
          url: '/' + file,
          // eslint-disable-next-line camelcase
          static_files: join('storage', file).replaceAll('\\', '/'),
          upload: join('storage', file).replaceAll('\\', '/'),
          secure: 'always',
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
        ...prerenderedAssets,
        ...additionalClientAssets,
        {
          url: `/${builder.config.kit.appDir}/immutable/`,
          // eslint-disable-next-line camelcase
          static_dir: `storage/${builder.config.kit.appDir}/immutable`,
          expiration: '30d 0h',
          secure: 'always',
        },
        {
          url: `/${builder.config.kit.appDir}/`,
          // eslint-disable-next-line camelcase
          static_dir: `storage/${builder.config.kit.appDir}`,
          secure: 'always',
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
          runtime: `nodejs${nodejsRuntime}`,
          entrypoint: 'node index.js',
          // eslint-disable-next-line camelcase
          default_expiration: '0h',
          handlers: serverRoutes,
        }),
      );

      builder.log.success(`To deploy, run "gcloud app deploy --project <CLOUD_PROJECT_ID> ${out}/app.yaml"`);
    },
  };
}
