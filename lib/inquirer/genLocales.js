#!/usr/bin/env node
const chalk = require("chalk");
const readConfig = require("../vendors/applyReadConfig")
const log = content => console.log(chalk.green(content));
const logErr = content => console.log(chalk.red(content));

const createFile = require("..");

module.exports = async () => {
  log("Start import .xlsx file");
  try {
		const config = readConfig('intl.config.ts');
    createFile("gen:locales", config);
  } catch (error) {
    logErr(error);
  }
};