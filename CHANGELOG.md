# Changelog

## [0.8.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.7.0...v0.8.0) (2022-07-06)


### Features

* add `external` adapter option passed though to esbuild ([9171055](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/91710558c589ce8276fbf08acf6aa27e0dd36fae))

## [0.7.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.6.1...v0.7.0) (2022-07-05)


### Features

* Change build dir to `build` to follow conventions ([73cbfc7](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/73cbfc741ffaddc0b09bdf2236c4d33e4c4f4a35))
* Only serve immutable files with cache expiration  ([3bd4960](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/3bd4960c0db80f30f7588abbfdcecedcf33a5992))
* Update esbuild to include source map ([b60f318](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/b60f318efde01d026c80653c0f1a361e8fbaffdb))


### Bug Fixes

* only set long expiration for files in _app/immutable directory ([89bc1c6](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/89bc1c6954525415a156e088f52dc868ef6143b3))
* Remove compression from serving ([08746d4](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/08746d438409e62e475361b0b73ab1c10129a5a4))

### [0.6.1](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.6.0...v0.6.1) (2022-06-15)


### Bug Fixes

* Adjust imports to support sveltekit >= 341 ([9fb0b0e](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/9fb0b0e6918e2fd705572258afcdf3f61e162c72))

## [0.6.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.5.1...v0.6.0) (2022-03-26)


### ⚠ BREAKING CHANGES

* Update to support sveltekit >= 292

### Code Refactoring

* Update to support sveltekit >= 292 ([885b03d](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/885b03d2f97378836b6821161480f0a54c43ecd0))

### [0.5.1](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.5.0...v0.5.1) (2022-02-23)


### Bug Fixes

* Minor routing fix ([8109808](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/8109808462b8f4f8ee58572bbda5bb1b01e7bae4))

## [0.5.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.4.0...v0.5.0) (2022-02-23)


### ⚠ BREAKING CHANGES

* Refactor to support changes in sveltekit 280

### Code Refactoring

* Refactor to support changes in sveltekit 280 ([e3086af](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/e3086af4366d29be1424e974f4936cc39353b05e))

## [0.4.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.3.0...v0.4.0) (2022-01-20)


### Features

* Add support for custom app.yaml file. Fixes [#14](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/14) ([4f2a4d6](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/4f2a4d61004e436368e2b5eb1343f99f8ae1eb95))

## [0.3.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.2.1...v0.3.0) (2022-01-20)


### ⚠ BREAKING CHANGES

* Make changes to support new request format in sveltekit

### Code Refactoring

* Make changes to support new request format in sveltekit ([5223c9a](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/5223c9a66e0b31876f61412eb6da96af44fca477))

### [0.2.1](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.2.0...v0.2.1) (2022-01-07)


### Bug Fixes

* Fix issue where some paths where not added to yaml ([401ff61](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/401ff61606bb3bb2f13cda0ee302cdb1a4027b7e))

## [0.2.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.1.1...v0.2.0) (2022-01-07)


### ⚠ BREAKING CHANGES

* Update adapter to latest sveltekit version.

### Code Refactoring

* Update adapter to latest sveltekit version. ([a2fbd3a](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/a2fbd3a723cc8d28781306ef022ece03e0fac33a)), closes [#5](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/5)

### [0.1.1](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.1.0...v0.1.1) (2021-11-09)


### Bug Fixes

* Handle paths in windows correctly in app.yaml ([77624eb](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/77624eb6d8a70754e495493d49903d048051ab27))

## [0.1.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.0.1...v0.1.0) (2021-10-20)


### Features

* Correctly handle index.html paths in app.yaml ([350fc88](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/350fc883c8f2cfa926b89bfb289b22d87255ee30))
