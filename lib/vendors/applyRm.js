/**
 * @file applyRm.js
 * @description remove directory
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

function deleteDirectory(directoryPath) {
  let files;
  try {
    files = fs.readdirSync(directoryPath);
  } catch (e) {
    return;
  }
  if (files.length > 0) {
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        deleteDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
  fs.rmdirSync(directoryPath);
  log(`Directory ${directoryPath} has been deleted`);
}

module.exports = function (directoryPath) {
  deleteDirectory(directoryPath);
}