import { Options } from '@/types';

export function resolveOptions(options: Partial<Options>) {
  return {
    path: process.cwd(),
    buildDir: null,
    quick: false,
    isCli: false,
    ...options,
    lastEdit: options?.lastEdit ? parseInt(options.lastEdit as string) : 7,
    depth: options?.depth ? parseInt(options.depth as string) : 2,
  };
}
