/**
 * @file applyJson2Xlsx.js
 * @description transfer json to xlsx
 * @author pipi(rzh881004@icloud.com)
 */
// TODO: support custom plugins
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx-js-style');
const chalk = require("chalk");
const crypto = require('crypto');
function generate6CharHash() {
  return crypto.randomBytes(3).toString('hex');
}
const log = content => console.log(chalk.green(content));
function genHeaderStyle(fgColorRGB) {
  return {
    font: {
      bold: true,
      sz: 14,
      name: "Calibri",
    },
    fill: {
      patternType: "solid",
      fgColor: { rgb: fgColorRGB }
    },
    alignment: {
      horizontal: "center",
      vertical: "center"
    }
  }
}

function genCellStyle(fgColorRGB) {
  return {
    fill: {
      patternType: "solid",
      fgColor: { rgb: fgColorRGB }
    }
  }
}

const colDefault = 'B'
const langCache = {}

function processJsonFile(jsonFilePath, sheetName, workbook, languages) {
  const [defaultLangScope, ...langScopes] = languages
  // get directory path from jsonFilePath
  const dirPath = path.dirname(jsonFilePath);
  // get relative path
  const relativePath = dirPath.split(defaultLangScope)[1].substring(1);
  let filePath = relativePath + '/' + sheetName;

  // limit sheet name length to 31 characters
  if (filePath.length > 31) {
    sheetName = sheetName + '@' + generate6CharHash()
    if (sheetName.length > 31) {
      sheetName = generate6CharHash()
    }
  } else {
    if (relativePath) {
      sheetName = filePath.replace(/\//g, '|');
    }
  }

  // read JSON file
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  const data = [];

  const exLangScopes = []
  langScopes.forEach((scope,) => {
    exLangScopes.push({
      v: `${scope}(Google Tran)`, s: genHeaderStyle("ef5767")
    }, {
      v: scope,
      s: genHeaderStyle("b8f1ed")
    })
  })

  data.push(['FilePath', filePath].map(item => {
    return typeof item === 'string' ? {
      v: item,
      s: genHeaderStyle("b8f1cc")
    } : item
  }))

  data.push(['Key', defaultLangScope, ...exLangScopes].map(item => {
    return typeof item === 'string' ? {
      v: item,
      s: genHeaderStyle("b8f1cc")
    } : item
  }))

  function genExLangData(count, lang, index) {
    return [{
      f: `GoogleTranslate(${colDefault}${count + 2}, "${defaultLangScope}", "${langScopes[index]}")`, s: genCellStyle("AAB1B8")
    }, lang || {
      v: '',
      s: genCellStyle("ffe647")
    }]
  }

  function genExLangArr(count, langKey) {
    const arr = []
    let data = null
    for (i = 0; i < langScopes.length; i++) {
      const filePath = jsonFilePath.replace(defaultLangScope, langScopes[i]);
      if (!langCache[langScopes[i]]) {
        langCache[filePath] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      data = langCache[filePath]
      arr.push(...genExLangData(count, data[langKey], i))
    }
    return arr
  }

  // transfer json to xlsx rows data
  const keys = Object.keys(jsonData)
  keys.forEach((key, index) => {
    const count = index + 1
    if (jsonData.hasOwnProperty(key)) {
      data.push([key, jsonData[key], ...genExLangArr(count, key)]);
    }
  })

  // create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  worksheet['!cols'] = data[0].map(width => ({
    width: 35
  }));
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
}

// generate excel file from json files(multiple sheets)
function walkMultipleSheet(sourceDir, workbook, languages) {
  fs.readdirSync(sourceDir).forEach(file => {
    const sourceFilePath = path.join(sourceDir, file);
    const stats = fs.statSync(sourceFilePath);
    if (stats.isDirectory()) {
      // subdirectory, recursively process
      walkMultipleSheet(sourceFilePath, workbook, languages);
    } else if (path.extname(sourceFilePath) === '.json') {
      const sheetName = path.basename(sourceFilePath, '.json');
      processJsonFile(sourceFilePath, sheetName, workbook, languages);
    }
  });
}

const allData = []
// transfer json to xlsx rows data
function tranJsonFile2Data(jsonFilePath, languages) {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  const [defaultLangScope, ...langScopes] = languages
  // 获取目录路径中最后一个斜杠之后的部分
  const { dir, name } = path.parse(jsonFilePath.split(defaultLangScope)[1].substring(1));
  const relativePath = path.join(dir, name)
  const exLangScopes = []
  langScopes.forEach((scope,) => {
    exLangScopes.push({
      v: `${scope}(Google Tran)`, s: genHeaderStyle("ef5767")
    }, {
      v: scope,
      s: genHeaderStyle("b8f1ed")
    })
  })

  allData.push(['FilePath', relativePath].map(item => {
    return typeof item === 'string' ? {
      v: item,
      s: genHeaderStyle("b8f1cc")
    } : item
  }))

  allData.push(['Key', defaultLangScope, ...exLangScopes].map(item => {
    return typeof item === 'string' ? {
      v: item,
      s: genHeaderStyle("b8f1cc")
    } : item
  }))

  function genExLangData(count, lang, index) {
    return [{
      f: `GoogleTranslate(${colDefault}${count + 2}, "${defaultLangScope}", "${langScopes[index]}")`, s: genCellStyle("AAB1B8")
    }, lang || {
      v: '',
      s: genCellStyle("ffe647")
    }]
  }

  function genExLangArr(count, langKey) {
    const arr = []
    let data = null
    for (i = 0; i < langScopes.length; i++) {
      const filePath = jsonFilePath.replace(defaultLangScope, langScopes[i]);
      if (!langCache[langScopes[i]]) {
        langCache[filePath] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      data = langCache[filePath]
      arr.push(...genExLangData(count, data[langKey], i))
    }
    return arr
  }
  const keys = Object.keys(jsonData)
  keys.forEach((key) => {
    const count = allData.length - 1
    if (jsonData.hasOwnProperty(key)) {
      allData.push([key, jsonData[key], ...genExLangArr(count, key)]);
    }
  })
}

// deal with single sheet
function processSingleSheet(sourceDir, workbook, languages) {
  fs.readdirSync(sourceDir).forEach(file => {
    const sourceFilePath = path.join(sourceDir, file);
    const stats = fs.statSync(sourceFilePath);
    if (stats.isDirectory()) {
      // subdirectory, recursively process
      processSingleSheet(sourceFilePath, workbook, languages);
    } else if (path.extname(sourceFilePath) === '.json') {
      tranJsonFile2Data(sourceFilePath, languages);
    }
  });
}

// generate excel file from json files(single sheet)
function walkSingleSheet(sourceDir, workbook, languages) {
  processSingleSheet(sourceDir, workbook, languages);
  const worksheet = XLSX.utils.aoa_to_sheet(allData);
  worksheet['!cols'] = allData[0].map(width => ({
    width: 35 // 设置最小宽度为10字符
  }));
  XLSX.utils.book_append_sheet(workbook, worksheet, generate6CharHash());
}

module.exports = function generateExcelFile(sourceDirectory, outputFilePath, languages, sheetMode = 'multiple') {
  log(`Generating Excel file: ${outputFilePath} using ${sheetMode} mode`);
  const [defaultLangScope] = languages
  const defaultSourceDirectory = path.join(sourceDirectory, defaultLangScope)
  // create a new workbook
  const workbook = XLSX.utils.book_new();
  if (sheetMode === 'multiple') {
    walkMultipleSheet(defaultSourceDirectory, workbook, languages);
  } else if (sheetMode === 'single') {
    walkSingleSheet(defaultSourceDirectory, workbook, languages);
  } else {
    logErr(`SheetMode ${sheetMode} is not supported`)
  }
  const outputFileDirPath = path.dirname(outputFilePath)
  if (!fs.existsSync(outputFileDirPath)) {
    fs.mkdirSync(outputFileDirPath, { recursive: true });
  }
  // write the workbook to an Excel file
  XLSX.writeFile(workbook, outputFilePath);
  log(`Generated Excel file: ${outputFilePath}`);
}