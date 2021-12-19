#!/usr/bin/env node

const program = require('commander');

program.version(`nodeclean - ${require('../package').version}`).usage('[options]');

program
  .option('-p --path [path]', 'path to dir to being search for [defaults CWD]')
  .option('-d --depth [depth]', 'the depth of dir to search [defaults 2]')
  .option(
    '-l --last-edit [lastEdit]',
    `only detect node_modules folders where the parent hasn't been edited in X amount of days [default 7]`,
  )
  .option('-b --build-dir [buildDirName]', 'delete the build directory as well as node_module')
  .option('-q --quick', `don't bother calculating the size of folders`)
  .action((options) => {
    require('../dist/commands/nodeclean').default({ ...options, isCli: true });
  });

program.parse(process.argv);
