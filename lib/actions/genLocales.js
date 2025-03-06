const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const importXlsx2Ts = require("../vendors/applyXlsx2Ts")
const rm = require("../vendors/applyRm")
const diffFiles = require("../vendors/applyDiffResult")
const createIndexs = require("../vendors/applyCreateIndexs")
const createEntry = require("../vendors/applyCreateEntry")
const createTypes = require("../vendors/applyCreateTypeTs")
const cp2Origin = require("../vendors/applyCP2Source")
const logErr = content => console.log(chalk.red(content));

/**
 * comfirm use spreader plugin
 * @returns neat config
 */
const confirmUseSpreader = (config = '') => {
  const questions = [
    {
      name: "USE_SPREADER",

      type: "confirm",
      prefix: "",
      message: `Whether to run a custom Spreader Plugin(localed ${config}) after the update is complete?`,
      default: true
    },
  ];
  return inquirer.prompt(questions);
};

/**
 * comfirm cover all files
 * @returns neat config
 */
const confirmAllCover = (config = '') => {
  const questions = [
    {
      name: "COVER",

      type: "confirm",
      prefix: "",
      message: `Whether to completely overwrite the ${config} folder?`,
      default: true
    },
  ];
  return inquirer.prompt(questions);
};

/**
 * confirm diff files
 * @returns neat config
 */
const confirmDiff = () => {
  const questions = [
    {
      name: "DIFF",

      type: "confirm",
      prefix: "",
      message: `Whether to diff?`,
      default: true
    },
  ];
  return inquirer.prompt(questions);
};

module.exports = async (config) => {
  const { spaceDir, columns, languages, importFilePath, originDir, sheetMode } = config || {};
  const { plugins, ...rest } = config || {}
  const { spreader } = plugins || {}
  try {
    const targetDir = path.resolve(path.join(spaceDir, 'dist/locales'))

    rm(targetDir)

    const importFile = path.resolve(path.join(spaceDir, importFilePath))

    await importXlsx2Ts(targetDir, importFile, columns, languages, sheetMode)
    await createIndexs(targetDir)
    await createEntry( targetDir, languages)
    await createTypes(targetDir, languages)

    const { DIFF } = await confirmDiff()
    if (DIFF) {
      await diffFiles(originDir, targetDir)
    }
    
    const { COVER } = await confirmAllCover(originDir)
    if (COVER) {
      rm(originDir)
      fs.mkdirSync(originDir);
    }
    cp2Origin(targetDir, originDir)

    if (spreader) {
      const { USE_SPREADER } = await confirmUseSpreader(spreader);
      if (USE_SPREADER) {
        const modules = require(path.resolve(spreader))
        modules?.(rest)
      }
    }
  } catch (error) {
    logErr(error)
  }
};