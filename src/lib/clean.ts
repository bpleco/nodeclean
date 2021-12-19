import { Options } from '@/types';
import FastGlob from 'fast-glob';
import { resolveOptions } from './resolveOptions';
import { promisify } from 'util';
import folderSize from 'fast-folder-size';
import { stat, rm } from 'fs-extra';
import { join } from 'path';
import { deleted, foldersToDeleteDetail, foldersToDeleteQuickly, noMatchingPaths } from './console';

const fastFolderSize = promisify(folderSize);

function readableBytes(bytes: number) {
  var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const math = (bytes / Math.pow(1024, i)) * 1;

  return math.toFixed(2) + ' ' + sizes[i];
}

async function filterMatchingDirs(path: string, depth: number) {
  const filePaths = await FastGlob(path + '/**/node_modules/**', {
    onlyDirectories: true,
    deep: depth,
  });

  return filePaths.filter(
    (fp) => fp.match(/node_modules.*node_modules/is) === null && fp.endsWith('node_modules'),
  );
}

export async function nodeclean(userOptions?: Partial<Options>) {
  const { path, depth, quick, buildDir, lastEdit, isCli } = resolveOptions(userOptions);

  const filePaths = await filterMatchingDirs(path, depth);

  //   get last edit time of parent folder
  const statsPaths = await Promise.all(
    filePaths.map(async (fp) => {
      const stats = await stat(fp.replace('node_modules', ''));
      return { fp, editTime: stats.mtime };
    }),
  );

  //   check if parent folder matches last edit time filter && if build dir to delete
  const matchingPaths = await Promise.all(
    statsPaths
      .filter(({ editTime }) => new Date(Date.now() - 86400000 * lastEdit) > editTime)
      .map(async (folder) => {
        //  check if contains build dir to delete
        if (!buildDir) return { ...folder };

        const buildDirPath = join(folder.fp.replace('node_modules', 'dist'));

        let containsBuildDir = false;

        try {
          await stat(buildDirPath);
          containsBuildDir = true;
        } catch (_error) {}

        if (containsBuildDir) return { ...folder, buildDirPath };

        return { ...folder };
      }),
  );

  if (matchingPaths.length === 0) return noMatchingPaths(filePaths.length, isCli);

  if (quick) {
    // delete and return
    return await foldersToDeleteQuickly(matchingPaths, depth, lastEdit);
  }

  let totalSize = 0;

  const detailedMatchingPaths = await Promise.all(
    matchingPaths.map(async (mp: { buildDirPath: string; fp: string; editTime: Date }) => {
      const nmSize = await fastFolderSize(mp.fp);
      totalSize += nmSize;

      return { ...mp, size: readableBytes(nmSize) };
    }),
  );

  const confirmDelete = await foldersToDeleteDetail(
    detailedMatchingPaths,
    readableBytes(totalSize),
    depth,
    lastEdit,
  );

  if (!confirmDelete) return;

  if (isCli) console.log();

  await Promise.all(
    detailedMatchingPaths.map(async (folder) => {
      await deleteFolder(folder.fp);
      deleted(folder.fp, isCli);
      if (folder.buildDirPath) {
        await deleteFolder(folder.buildDirPath);
        deleted(folder.buildDirPath, isCli);
      }
    }),
  );

  if (isCli) console.log();
}

async function deleteFolder(path) {
  return rm(path, { recursive: true });
}
