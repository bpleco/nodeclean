import chalk from 'chalk';
import figures from 'figures';
import { prompt } from 'inquirer';

function pluralize(count: number, word: string) {
  return count === 1 ? word : `${word}s`;
}

export function noMatchingPaths(filteredPathCount: number, isCli: boolean) {
  if (isCli)
    console.log(
      chalk.bold(
        `${chalk.green(figures.tick)} Filtered ${filteredPathCount} ${pluralize(
          filteredPathCount,
          'folder',
        )} and there were no node_modules to delete`,
      ),
    );
}

export function deleted(filePath: string, isCli: boolean) {
  if (isCli)
    console.log(chalk.bold(`${chalk.green(figures.tick)} Successfully deleted ${filePath}`));
}

export async function foldersToDeleteQuickly(
  folders: (
    | { fp: string; editTime: Date }
    | { buildDirPath: string; fp: string; editTime: Date }
  )[],
  depth: number,
  lastEdit: number,
) {
  headLine(folders, depth, lastEdit);

  folders.forEach((folder) => listFolderDetail(folder, null));

  return await deleteFoldersConfirmation();
}

export async function foldersToDeleteDetail(
  folders: (
    | { size: string; fp: string; editTime: Date }
    | { size: string; buildDirPath: string; fp: string; editTime: Date }
  )[],
  totalSize: string,
  depth: number,
  lastEdit: number,
) {
  headLine(folders, depth, lastEdit);

  sizeHeadline(totalSize);

  const longestSize = getLongestSizeString(folders, 'size');

  folders.forEach((folder) => listFolderDetail(folder, longestSize));

  return await deleteFoldersConfirmation();
}

const headLine = (folders, depth, lastEdit) =>
  console.log(
    chalk.bold(
      `${chalk.green(figures.tick)} Found ${chalk.yellow(folders.length)} ${pluralize(
        folders.length,
        'folder',
      )} that matched your filter of ${chalk.yellow(depth)} ${pluralize(
        depth,
        'folder',
      )} deep & edited longer than ${chalk.yellow(lastEdit)} ${pluralize(lastEdit, 'day')} ago.`,
    ),
  );

const sizeHeadline = (totalSize) =>
  console.log(
    chalk.bold(
      `${chalk.cyan(figures.heart)} Total of ${chalk.green(
        totalSize,
      )} space reclaimed if you delete these folders`,
    ),
  );

function getLongestSizeString(folders: any[], query: string) {
  return folders.reduce((a, b) => (a.length > b[query].length ? a : b[query]), { [query]: '' })
    .length;
}

function padEnd(str, targetLength) {
  if (str.length >= targetLength) {
    return str;
  }

  return str.padEnd(targetLength);
}

function listFolderDetail(folder, longestSize) {
  const now = new Date(Date.now());
  var difference = now.getTime() - folder.editTime.getTime();
  var days = Math.round(difference / (1000 * 60 * 60 * 24));

  console.log(
    `   ${chalk.yellow(figures.arrowRight)} ${chalk.yellow(
      longestSize ? folderSize(folder.size, longestSize) + '    ' : '',
    )}${folder.fp} ${daysAgo(days)} ${chalk.dim(folder.buildDirPath ? '[build dir]' : '')}`,
  );
}

const daysAgo = (days) => chalk.gray(`[${days} days ago]`);

const folderSize = (size, longestSize) => {
  const str = padEnd(`${size}`, longestSize);
  return str ?? '';
};

async function deleteFoldersConfirmation() {
  console.log();
  const { confirmDelete } = await prompt({
    type: 'confirm',
    name: 'confirmDelete',
    message: 'Are you sure you want to delete these folders?',
  });

  return confirmDelete;
}
