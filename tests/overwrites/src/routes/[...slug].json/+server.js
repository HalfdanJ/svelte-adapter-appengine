// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import { json } from "@sveltejs/kit";

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  return json({ test: true });
}
