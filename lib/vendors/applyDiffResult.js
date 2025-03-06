/**
 * @file applyDiffResult.js
 * @description diff two directory and print diff result
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');
const diff = require('diff');
const chalk = require("chalk");
const logDim = content => console.log(chalk.dim(content));
const logErr = content => console.log(chalk.red(content));
const log = content => console.log(chalk.green(content));
const diffFiles = require('./applyDiffFiles');

// log diff result
function printDiff(file, fileAContent, fileBContent) {
  const diffResult = diff.diffLines(fileAContent, fileBContent);
  diffResult.forEach(part => {
    // green for additions, red for deletions
    // grey for common parts
    const value = part.value.replace(/\n$/, ''); // Remove trailing
    const lines = value.split('\n');
    if (part.removed) {
      lines.forEach(line => logErr(`- ${chalk.strikethrough(line.trim())}`))
    } else if (part.added) {
      lines.forEach(line => log(`+ ${line.trim()}`))
    } else {
      logDim(value)
    }
  });
}

module.exports = async function (originDir, targetDir) {
  const { deletedFiles, newFiles, changedFiles } = await diffFiles(originDir, targetDir, '.ts')
  logDim('Diff file result:')

  if (deletedFiles.length === 0 && newFiles.length === 0 && changedFiles.length === 0) {
    log(`No changes found`);
  }
  deletedFiles.forEach(file => logErr(`- ${chalk.strikethrough(file)}`));
  newFiles.forEach(file => log(`+ ${chalk.underline(file)}`));
  changedFiles.forEach(file => {
    log(`* ${file}`);
    printDiff(file, fs.readFileSync(path.join(originDir, file), 'utf8'), fs.readFileSync(path.join(targetDir, file), 'utf8'));
  });
}