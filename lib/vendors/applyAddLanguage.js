/**
 * @file applyAddLanguage.js
 * @description add new language files
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

function setAllValuesToEmptyString(obj) {
  Object.keys(obj).forEach(key => {
    obj[key] = '';
  });
  return obj;
}

// copy and modify json files
function copyAndModifyJsonFiles(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.readdirSync(srcDir, { withFileTypes: true }).forEach(entity => {
    const srcPath = path.join(srcDir, entity.name);
    const destPath = path.join(destDir, entity.name);

    if (entity.isDirectory()) {
      // sub directory recursion
      copyAndModifyJsonFiles(srcPath, destPath);
    } else if (entity.isFile() && entity.name.endsWith('.json')) {
      // copy json file
      fs.copyFileSync(srcPath, destPath);
      const jsonContent = fs.readFileSync(destPath, 'utf8');
      let jsonObject = JSON.parse(jsonContent);

      // clear all values
      jsonObject = setAllValuesToEmptyString(jsonObject);
      fs.writeFileSync(destPath, JSON.stringify(jsonObject, null, 2), 'utf8');
    } else {
      // copy other files
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

module.exports = function (srcDir, outDir, difference, defaultLanguage) {
  difference.forEach(lang => {
    const sourceDirectory = path.join(srcDir, defaultLanguage)
    const targetDirectory = path.join(outDir, lang)
    copyAndModifyJsonFiles(sourceDirectory, targetDirectory);
    log(`Added New Language File: ${targetDirectory}`);
  })
}

