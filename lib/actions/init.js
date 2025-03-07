#!/usr/bin/env node
const chalk = require("chalk");
const path = require("path");
const copyFolder = require("../vendors/applyCP");
const createTsConfig = require("../vendors/applyCreateTsConfig")
const rm = require("../vendors/applyRm")
const logErr = content => console.log(chalk.red(content));

module.exports = async ({ originDir, spaceDir, ignoredFiles, sourceDir }) => {
  try {
    const srcPath = path.join(spaceDir, sourceDir)
    rm(srcPath)
    const initSrcDir = path.join(spaceDir, sourceDir)
    copyFolder(originDir, initSrcDir, ignoredFiles);
    createTsConfig(spaceDir, sourceDir)
    const distPath = path.join(spaceDir, 'dist')
    rm(distPath)

  } catch (error) {
    logErr(error);
  }
};
