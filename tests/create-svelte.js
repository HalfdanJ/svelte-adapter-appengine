import process from "node:process";
// eslint-disable-next-line import/no-unresolved, node/no-missing-import, import/no-extraneous-dependencies, node/no-extraneous-import
import { create } from "create-svelte";

// Get target directory
const target = process.argv[2];

(async () => {
  await create(target, {
    name: "my-new-app",
    template: "default", // Or 'skeleton' or 'skeletonlib'
    types: "checkjs", // Or 'typescript' or null;
    prettier: false,
    eslint: false,
    playwright: false,
    vitest: false,
  });
})();
