import {writeFileSync} from 'node:fs';
import {join, posix} from 'node:path';
import {fileURLToPath} from 'node:url';
import YAML from 'yaml';
import esbuild from 'esbuild';

const files = fileURLToPath(new URL('./files', import.meta.url));

/** @type {import('.')} **/
export default function entrypoint() {
  return {
    name: 'appengine',

    async adapt(builder) {
      const dir = '.appengine_build_output';
      const temporary = builder.getBuildDirectory('appengine-tmp');

      builder.rimraf(dir);
      builder.rimraf(temporary);

      builder.log.minor('Copying assets');
      builder.writeClient(`${dir}/storage`);
      // Builder.writeServer(`${dir}/server`);
      builder.writeStatic(`${dir}/storage`);

      const relativePath = posix.relative(temporary, builder.getServerDirectory());

      builder.log.minor('Prerendering static pages');
      const prerenderedPaths = await builder.prerender({
        dest: `${dir}/storage`,
      });

      // Copy server handler
      builder.copy(files, temporary, {replace: {
        APP: `${relativePath}/app.js`,
      }});

      writeFileSync(
        `${temporary}/manifest.js`,
        `export const manifest = ${builder.generateManifest({
          relativePath,
        })};\n`,
      );

      await esbuild.build({
        entryPoints: [`${temporary}/entry.js`],
        outfile: `${dir}/index.js`,
        target: 'node16',
        bundle: true,
        platform: 'node',
      });

      writeFileSync(`${dir}/package.json`, JSON.stringify({type: 'commonjs'}));

      const serverRoutes = [];

      builder.createEntries(route => {
        const parts = [];

        for (const segment of route.segments) {
          if (segment.rest || segment.dynamic) {
            parts.push('.*');
          } else {
            parts.push(segment.content);
          }
        }

        const id = '/' + parts.join('/');
        return {
          id,
          filter: _ => true,
          complete: _ => {
            if (prerenderedPaths.paths.includes(id)) {
              const staticPath = join('storage', id, 'index.html');
              serverRoutes.push(
                {
                  url: id,
                  // eslint-disable-next-line camelcase
                  static_files: staticPath,
                  upload: staticPath,
                },
              );
            } else {
              serverRoutes.push(
                {
                  url: id,
                  secure: 'always',
                  script: 'auto',
                },
              );
            }
          },
        };
      });

      if (serverRoutes.length > 99) {
        throw new Error('Too many url routes: ' + serverRoutes.length);
      }

      writeFileSync(
        join(dir, 'app.yaml'),
        YAML.stringify({
          runtime: 'nodejs16',
          entrypoint: 'node index.js',
          handlers: [
            ...serverRoutes,
            {
              url: '/',
              // eslint-disable-next-line camelcase
              static_dir: 'storage',
            },
          ],
        }),
      );

      builder.log.success('To deploy, run "gcloud app deploy --project <CLOUD_PROJECT_ID> .appengine_build_output/app.yaml"');
    },
  };
}
