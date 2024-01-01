# svelte-adapter-appengine

Easily deploy your SvelteKit applications on [Google Cloud App Engine](https://cloud.google.com/appengine) with the `svelte-adapter-appengine` package.

[![npm](https://img.shields.io/npm/v/svelte-adapter-appengine?color=green)](https://www.npmjs.com/package/svelte-adapter-appengine)
[![Tests](https://github.com/halfdanj/svelte-adapter-appengine/actions/workflows/test.yml/badge.svg)](https://github.com/halfdanj/svelte-adapter-appengine/actions/workflows/test.yml)
[![SvelteKit](https://img.shields.io/badge/Works%20with-SvelteKit-ff3e00.svg)](https://kit.svelte.dev/)

## Getting Started

To set up the adapter in your SvelteKit project:

1. Install the package as a development dependency:

```bash
npm install --save-dev svelte-adapter-appengine

```

2. Update your `svelte.config.js` to use the adapter:

```diff
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
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

3. Build your application:

```bash
npm run build
```

4. Deploy your application to App Engine:

```bash
gcloud app deploy --project <CLOUD_PROJECT_ID> build/app.yaml
```

Learn more about the `gcloud` utility in the [official documentation](https://cloud.google.com/sdk/gcloud)

## Configuration Options

Customize the adapter behavior using the following options:

```ts
adapter({
  // Build output directory (default: `/build`)
  out: "/build",

  // Enable Google Cloud Tracing Agent for improved logging (default: `false`)
  useCloudTracing: false,

  // Enable or disable Google Cloud Logging (default: `false`)
  // See: https://cloud.google.com/logging/docs/overview
  useCloudLogging: false,

  // Specify external modules for the esbuild step
  external: [],

  // Specify Node modules to be added to the `package.json` file in the build step
  // These modules will be fetched when the application is deployed
  dependencies: [],

  // Set the Node.js version for the App Engine runtime (default: `18`)
  // See available runtimes: https://cloud.google.com/appengine/docs/standard/nodejs/runtime
  nodejsRuntime: 18,
});
```

You can also customize the generated `app.yaml` file by creating an `app.yaml` file in your project root. The adapter will merge your custom configuration with the generated `app.yaml`, allowing you to define custom machine types, routes, or other [app.yaml configurations](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=node.js).

## Adapter Output

The Server-Side Rendering (SSR) part of SvelteKit is hosted on App Engine using a Node.js runtime, using [polka](https://github.com/lukeed/polka) to mimic [@sveltejs/adapter-node
](https://github.com/sveltejs/kit/tree/master/packages/adapter-node).

Static files are served directly from Cloud Storage, bypassing the Node.js web server. The adapter automatically generates routes for all static assets in the `app.yaml` file.

## Example Application

Check out a live example application at [https://svelte-adapter-demo.uc.r.appspot.com//](https://svelte-adapter-demo.uc.r.appspot.com//). This demo app is the default SvelteKit template deployed with the default adapter settings.
