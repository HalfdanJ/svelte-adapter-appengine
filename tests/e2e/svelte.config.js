import appengine from 'svelte-adapter-appengine';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: appengine(),
    target: '#svelte',
  },
};

export default config;
