#!/usr/bin/env node
const path = require("path")
const fs = require("fs")
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

module.exports = async () => {
  try {
    const filePath = path.join(__dirname, '../index.d.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const startMarker = '/** languageCodes start */';
    const endMarker = '/** languageCodes end */';
    let extractedContent = '';
    const startIndex = fileContent.indexOf(startMarker);
    const endIndex = fileContent.indexOf(endMarker, startIndex + startMarker.length);
    if (startIndex !== -1 && endIndex !== -1) {
      extractedContent = fileContent.substring(startIndex + startMarker.length, endIndex);
    }
    log(extractedContent);
  } catch (error) {
    log(error);
  }
};
