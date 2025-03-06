/**
 * @file applyReadConfig.js
 * @description load ts config file
 * @author pipi(rzh881004@icloud.com)
 */
const path = require("path");
const chalk = require("chalk");
const tsLoader = require("../vendors/applyTsLoader")
const log = content => console.log(chalk.green(content));
const logCyan = content => console.log(chalk.cyan(content));

module.exports = function (tsConfigFileName) {
  const tsConfigFilePath = path.resolve(tsConfigFileName)
  // Read the TypeScript file content
  const tsFilePath = path.join(tsConfigFilePath);
  log('Reading your ts config file:')
  log(`path: ${tsFilePath}`)
  const config = tsLoader(tsFilePath);
  log('content: ')
  logCyan(JSON.stringify(config, null, 2));
  return config;
}