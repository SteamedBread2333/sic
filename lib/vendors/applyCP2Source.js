/**
 * @file applyCP2Source.js
 * @description copy source files
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

function copyDirectoryContents(source, target) {
  fs.readdirSync(source).forEach(file => {
    const sourceFilePath = path.join(source, file);
    const targetFilePath = path.join(target, file);
    if (fs.statSync(sourceFilePath).isDirectory()) {
      if (!fs.existsSync(targetFilePath)) {
        fs.mkdirSync(targetFilePath);
      }
      copyDirectoryContents(sourceFilePath, targetFilePath);
    } else {
      fs.copyFileSync(sourceFilePath, targetFilePath);
    }
  });
}

module.exports = function (sourceDir, targetDir) {
  copyDirectoryContents(sourceDir, targetDir)
  log(`Files and directories have been copied from '${sourceDir}' to '${targetDir}'`);
}
