import appengine from "svelte-adapter-appengine";

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: appengine(),
    target: "#svelte",
  },
};
