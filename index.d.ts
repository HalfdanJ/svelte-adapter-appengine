import {type Adapter} from '@sveltejs/kit';
// eslint-disable-next-line import/no-unassigned-import
import './ambient.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const ENV_PREFIX: string;
}

type AdapterOptions = {
  /** Directory for build output */
  out?: string;
  /** Use improved cloud logging, defaults to true */
  useCloudLogging?: boolean;
  /** Modules marked as external in esbuild */
  external?: string[];
  /** Dependencies to be added in package.json */
  dependencies?: Record<string, string>;
};

export default function plugin(options?: AdapterOptions): Adapter;
