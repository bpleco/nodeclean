import { nodeclean } from '@/lib/clean';
import { Options } from '@/types';

export default async function (options: Partial<Options>) {
  await nodeclean(options);
}
