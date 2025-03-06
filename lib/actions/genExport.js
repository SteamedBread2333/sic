const fs = require('fs');
const chalk = require("chalk");
const path = require("path");
const ts2Js = require("../vendors/applyTs2Js")
const js2Json = require("../vendors/applyJs2Json")
const generateExcelFile = require("../vendors/applyJson2Xlsx")
const addLangJson = require("../vendors/applyAddLanguage")
const logErr = content => console.log(chalk.red(content));

module.exports = async ({ spaceDir, languages, exportFilePath, sheetMode }) => {
  try {
    const srcDir = path.resolve(path.join(spaceDir))
    const jsOutDir = path.resolve(path.join(spaceDir, 'dist/js'))
    const jsonOutDir = path.resolve(path.join(spaceDir, 'dist/json'))
    const exportFile = path.resolve(path.join(spaceDir, exportFilePath))
    // tsc编译
    await ts2Js(srcDir, jsOutDir)
    await js2Json(jsOutDir, jsonOutDir)
    const sourceLangDirs = fs.readdirSync(jsOutDir)
    const difference = languages.filter(value => !sourceLangDirs.includes(value));
    const [defaultLanguage] = languages
    if (difference && difference.length) {
      addLangJson(jsonOutDir, jsonOutDir, difference, defaultLanguage)
    }
    generateExcelFile(jsonOutDir, exportFile, languages, sheetMode)
  } catch (error) {
    logErr(error)
  }
};