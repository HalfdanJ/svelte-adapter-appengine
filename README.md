# svelte-adapter-appengine

Utilize the [Google Cloud App Engine](https://cloud.google.com/appengine) infrastructure to host SvelteKit content.

[![npm](https://img.shields.io/npm/v/svelte-adapter-appengine?color=green)](https://www.npmjs.com/package/svelte-adapter-appengine)
[![Tests](https://github.com/halfdanj/svelte-adapter-appengine/actions/workflows/test.yml/badge.svg)](https://github.com/halfdanj/svelte-adapter-appengine/actions/workflows/test.yml)

## Setup

In your standard SvelteKit project:

- `npm install --save-dev svelte-adapter-appengine`
- add adapter to `svelte.config.js`:

```diff
import { vitePreprocess } from '@sveltejs/kit/vite';
+import adapter from "svelte-adapter-appengine";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
+   adapter: adapter(),
  },
};

export default config;
```

- `npm run build`.
- Application can then be deployed by running `gcloud app deploy --project <CLOUD_PROJECT_ID> build/app.yaml`. (learn more about gcloud utility [here](https://cloud.google.com/sdk/gcloud))

## Configuration

Following configuration options are available

```ts
adapter({
  // Output directory of build step, defaults to `/build`
  out: "/build",
  // Enable Google Cloud Tracing Agent, enabling this with Cloud Logging improves
  // logs in Google Cloud Logging by bunding them by traces
  useCloudTracing: false,
  // Enable or disable Google Cloud Logging (https://cloud.google.com/logging/docs/overview).
  useCloudLogging: false,
  // Node modules that the esbuild step should mark as external.
  external: [],
  // Node modules that should be added to `package.json` file in the build step.
  // These modules will be fetched when the application is deployed.
  dependencies: [],
  // Node version to use in appengine runtime. See available runtimes here:
  // https://cloud.google.com/appengine/docs/standard/nodejs/runtime.
  nodejsRuntime: 16,
});
```

The generated `app.yaml` file can be customized by adding a file named `app.yaml` in the root of the project. The adapter will merge this file with the generated `app.yaml` file, enabling for example custom machine types, added routes or any other [app.yaml configuration](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=node.js)

## Adapter Output

The SSR part of SvelteKit is hosted on App Engine in a nodejs runtime. It's running using [polka](https://github.com/lukeed/polka) mimicking [@sveltejs/adapter-node
](https://github.com/sveltejs/kit/tree/master/packages/adapter-node).

Static files are served directly from Cloud Storage without going through the nodejs webserver. Routes for all the static assets are automatically generated in `app.yaml` by the adapter.

## Example

An examplee app can be accessed on [https://svelte-demo-329602.uc.r.appspot.com/](https://svelte-demo-329602.uc.r.appspot.com/), this is the default demo app from sveltekit deployed with the default settings.
