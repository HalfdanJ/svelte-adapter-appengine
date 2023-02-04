# Changelog

## [0.10.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.9.3...v0.10.0) (2023-02-04)


### Features

* Add option to select GAE nodejs version ([#70](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/70)) ([6db2125](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/6db21252334f50050ac010a8baf4a12fc678b8a7))
* Add support for Google Cloud Logging ([#67](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/67)) ([0dcc8a7](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/0dcc8a78cefe44045b46beab755cfab88a86a788))


### Bug Fixes

* Add favicon to app.yaml ([#68](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/68)) ([25ddfc2](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/25ddfc2bdeb117cc9925c7a543aadf39707ef4ac))

### [0.9.3](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.9.2...v0.9.3) (2023-01-21)


### Bug Fixes

* Add prerendered assets to app.yaml ([#64](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/64)) ([8afbc21](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/8afbc21b039ddf95239bd6184b7db66a6621543c))

### [0.9.2](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.9.1...v0.9.2) (2022-10-14)


### Bug Fixes

* Mark all paths as secure. ([243af43](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/243af43a3791d273e7bd39e38fd357eab4af6479)), closes [#50](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/50)
* Set default expiration to none ([83a792d](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/83a792d5a56844b13414d37bf00d0f6cbcd333d8))
* Small appyaml fixes ([#57](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/57)) ([d19cdfc](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/d19cdfc2e344173000dad25f43be0c5f19868f51))

### [0.9.1](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.9.0...v0.9.1) (2022-09-13)


### Bug Fixes

* Correctly read the protocol on localhost ([64889fa](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/64889fa1464d5e5aaa64c6b725baef9dd5264d56))
* Solve multiple issues from sveltekit breaking changes ([#52](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/52)) ([450f29d](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/450f29dcb0e016435c1697cf10560a4b1b27cdc6))
* update getRequest method call ([cdf93a2](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/cdf93a21cb80597abb52d8b31c40c804259e559a))

## [0.9.0](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.8.2...v0.9.0) (2022-08-26)


### Features

* Return `200 OK` from `/_ah/start` ([f5f7e64](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/f5f7e64d3372aa8d3efd91bc98ba6c0a73522de0))

### [0.8.2](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.8.1...v0.8.2) (2022-08-26)


### Bug Fixes

* Add server init ([f59b92c](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/f59b92c25f8710c9e25586a2d549519be8f416b2)), closes [#44](https://www.github.com/HalfdanJ/svelte-adapter-appengine/issues/44)
* Modify test to support sveltekit 406 ([ef11d09](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/ef11d09d0c91045b989ab1a726855282a3c54982))

### [0.8.1](https://www.github.com/HalfdanJ/svelte-adapter-appengine/compare/v0.8.0...v0.8.1) (2022-07-19)


### Bug Fixes

* Remove writeStatic from adapter code ([534d559](https://www.github.com/HalfdanJ/svelte-adapter-appengine/commit/534d55911cc2e5a1a3dfabb125a3198357f8e2f8))

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
