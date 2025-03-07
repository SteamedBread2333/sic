#!/usr/bin/env node
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));
const logErr = content => console.log(chalk.red(content));

const createFile = require("..");

module.exports = async (config = {}) => {
  log("Start import .xlsx file, please wait...");
  try {
    createFile("ts", config);
  } catch (error) {
    logErr(error);
  }
};