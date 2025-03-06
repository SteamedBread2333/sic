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

// get col data by header idx
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
  // 读取.xlsx文件
  const workbook = XLSX.readFile(path.resolve(importFile));
  // 遍历所有工作表
  workbook.SheetNames.forEach(sheetName => {

    // 获取工作表对象
    const worksheet = workbook.Sheets[sheetName];

    // 将工作表转换为JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

    const filePath = data[0][1];
    if (data.length > 0) {
      if (sheetMode === 'multiple') {
        let dataTemps = {};
        allLangScopes.forEach((scope) => {
          dataTemps[scope] = getColDataByHeaderIdx(data, langIdxMapping[scope]?.[0], langIdxMapping[scope]?.[1]);
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
      } else if (sheetMode === 'single') {
        let currentPath = '';
        let idxToLang = {}
        const groupedData = {};
        for (const row of data) {
          // when row[0] is FilePath, set currentPath to row[1]
          if (row[0] === 'FilePath') {
            currentPath = row[1];
            allLangScopes.forEach((lang) => {
              if (!groupedData?.[lang]) {
                groupedData[lang] = {
                  [currentPath]: {}
                }
              }
              if (!groupedData[lang]?.[currentPath]) {
                groupedData[lang][currentPath] = {}
              }
            })
            continue;
          }
          if (row[0] === 'Key') {
            const [key, ...langKeys] = row;
            langKeys.forEach((lang, idx) => {
              if (allLangScopes.includes(lang)) {
                idxToLang[idx] = lang;
              }
            })
            continue
          }

          const [key, ...langsVals] = row;
          if (currentPath) {
            langsVals.forEach((val, idx) => {
              if (allLangScopes.includes(idxToLang[idx])) {
                groupedData[idxToLang[idx]][currentPath][key] = val
              }
            })
          }
        }
        allLangScopes.forEach((lang) => {
          const dataTemps = groupedData[lang];
          const dataTempsKeys = Object.keys(dataTemps);
          dataTempsKeys.forEach((key) => {
            let interfaceString = `// This file is generated automatically
export default `;
            interfaceString += JSON.stringify(dataTemps[key], null, 2);
            const outputFilePath = path.join(targerDir, lang, `${key}${suffix}`);
            const relativePath = path.dirname(outputFilePath);

            if (!fs.existsSync(relativePath)) {
              fs.mkdirSync(relativePath, { recursive: true });
            }

            logCyan(`Writing to: ${outputFilePath}`);
            fs.writeFileSync(outputFilePath, interfaceString);
          });
        })
      } else {
        logCyan(`Invalid sheet mode: ${sheetMode}`);
      }
    } else {
      logCyan(`No data in sheet: ${sheetName}`);
    }
  });
}