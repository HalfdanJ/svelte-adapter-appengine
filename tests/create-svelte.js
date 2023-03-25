import {create} from 'create-svelte';
import process from 'node:process';

// Get target directory
const target = process.argv[2];

await create(target, {
  name: 'my-new-app',
  template: 'default', // Or 'skeleton' or 'skeletonlib'
  types: 'checkjs', // Or 'typescript' or null;
  prettier: false,
  eslint: false,
  playwright: false,
  vitest: false,
});
