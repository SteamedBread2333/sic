/**
 * @file applyCreateTsConfig.js
 * @description create tsconfig.json file
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

module.exports = function (spaceDir, sourceDir) {
  const jsonContent = {
    "include": [`${sourceDir}/**/*`],
    "exclude": ["node_modules", "build", "dist"]
  };
  const outputFilePath = path.join(spaceDir, 'tsconfig.json');
  const jsonString = JSON.stringify(jsonContent, null, 2);
  fs.writeFile(outputFilePath, jsonString, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    log(`Generated tsconfig.json file in ${outputFilePath}`);
  });
}