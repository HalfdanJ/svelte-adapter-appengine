import adapter from 'svelte-adapter-appengine';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      entries: ['/test.json', '*'],
    },
  },
};

export default config;
