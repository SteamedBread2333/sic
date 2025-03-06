/**
 * @file applyJs2Json.js
 * @description excute .js to json data
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const logCyan = content => console.log(chalk.cyan(content));

module.exports = async function walkDirectory(sourceDir, destinationDir) {
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  const sourceLangDirs = fs.readdirSync(sourceDir)
  sourceLangDirs.forEach(file => {
    const sourceFilePath = path.join(path.resolve(sourceDir), file);
    if (fs.statSync(sourceFilePath).isDirectory()) {
      const newDestinationDir = path.join(path.resolve(destinationDir), file);
      walkDirectory(sourceFilePath, newDestinationDir);
    } else if (path.extname(sourceFilePath) === '.js') {
      // ignore index.js
      if (sourceFilePath.includes('index.js')) {
        return void 0;
      }
      // when file is .js, convert to .json
      const exports = require(sourceFilePath).default;
      const relativePath = path.relative(sourceDir, sourceFilePath);
      const jsonFilePath = path.join(destinationDir, path.basename(relativePath, path.extname(relativePath))) + '.json';
      logCyan(`Writing to: ${jsonFilePath}`)
      const directoryPath = path.dirname(jsonFilePath);

      // compare if directory exists, if not, create it
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      // write json file
      fs.writeFileSync(jsonFilePath, JSON.stringify(exports.default || exports, null, 2), 'utf8');
    }
  });
}