/**
 * @file applyXlsx2Ts.js
 * @description transfer xlsx to ts
 * @author pipi(rzh881004@icloud.com)
 */
// TODO: support custom plugins
const XLSX = require('xlsx-js-style');
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const logCyan = content => console.log(chalk.cyan(content));

const suffix = `.ts`;

// Get col data by header idx
function getColDataByHeaderIdx(data, idx, standByIdx, offset = 2) {
  const result = {};
  for (let i = offset; i < data.length; i++) {
    if (data[i] && data[i].length) {
      result[data[i][0]] = data[i][idx] ? data[i][idx] : standByIdx ? data[i][standByIdx] : '';
    }
  }
  return result;
}

module.exports = async function (targerDir, importFile, langIdxMapping, allLangScopes, sheetMode = 'multiple') {
  const workbook = XLSX.readFile(path.resolve(importFile));
  function parse(rows, filePath, offset = 2) {
    let dataTemps = {};
    allLangScopes.forEach((scope) => {
      dataTemps[scope] = getColDataByHeaderIdx(rows, langIdxMapping[scope]?.[0], langIdxMapping[scope]?.[1], offset);
    });

    if (Object.keys(dataTemps).length === 0) {
      console.log(`No data found for sheet: ${sheetName}`);
      return;
    }

    const dataTempsKeys = Object.keys(dataTemps);
    dataTempsKeys.forEach((key) => {
      let interfaceString = `// This file is generated automatically
export default `;
      interfaceString += JSON.stringify(dataTemps[key], null, 2);
      const outputFilePath = path.join(targerDir, key, `${filePath}.ts`);
      const relativePath = path.dirname(outputFilePath);

      if (!fs.existsSync(relativePath)) {
        fs.mkdirSync(relativePath, { recursive: true });
      }

      logCyan(`Writing to: ${outputFilePath}`);
      fs.writeFileSync(outputFilePath, interfaceString);
    });
  }

  if (sheetMode === 'multiple') {
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
      if (data.length > 0) {
        const filePath = data[0][1];
        parse(data, filePath);
      } else {
        logCyan(`No data in sheet: ${sheetName}`);
      }
    });
  } else if (sheetMode === 'single') {
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
    let currentPath = '';
    let dataRows = []
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      // when row[0] is FilePath, set currentPath to row[1]
      if (row[0] === 'FilePath') {
        if (dataRows.length > 0) {
          parse(dataRows, currentPath, 0);
          dataRows = [];
        }
        if (!currentPath || row[1] !== currentPath) {
          currentPath = row[1];
        }
        continue;
      }
      // when row[0] is Key, skip
      if (row[0] === 'Key') {
        continue
      }
      // when row[0] is not empty, push row to dataRows
      if (currentPath && row[0]) {
        dataRows.push(row);
      }
      // when row[0] is empty, parse dataRows
      if (i === data.length - 1) {
        parse(dataRows, currentPath, 0);
        break;
      }
    }
  } else {
    logCyan(`Invalid sheet mode: ${sheetMode}`);
  }

}