import {type Middleware} from 'polka';

declare module 'ENV' {
  export function env(key: string, fallback?: any): string;
}

declare module 'HANDLER' {
  export const handler: Middleware;
}

declare module 'MANIFEST' {
  import {type SSRManifest} from '@sveltejs/kit';

  export const manifest: SSRManifest;
  export const prerendered: Set<string>;
}

declare module 'SERVER' {
  export {Server} from '@sveltejs/kit';
}

declare namespace App {
  export type Platform = {
    /**
		 * The original Node request object (https://nodejs.org/api/http.html#class-httpincomingmessage)
		 */
    req: IncomingMessage;
  };
}
