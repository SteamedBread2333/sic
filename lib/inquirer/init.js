#!/usr/bin/env node
const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path")
const log = content => console.log(chalk.green(content));
const logErr = content => console.log(chalk.red(content));

/**
 * confirm use collector
 * @returns neat config
 */
const confirmUseCollector = (config = {}) => {
  const questions = [
    {
      name: "USE_COLLECTOR",

      type: "confirm",
      prefix: "",
      message: `Whether to run a custom Collector Plugin(localed ${config}) before init?`,
      default: true
    },
  ];
  return inquirer.prompt(questions);
};

const createFile = require("..");

module.exports = async (config = {}) => {
  log("Begin init Work Space...");
  try {
    const { plugins, ...rest } = config || {}
    const { collector } = plugins || {}
    if (collector) {
      const { USE_COLLECTOR } = await confirmUseCollector(collector);
      if (USE_COLLECTOR) {
        const modules = require(path.resolve(collector))
        modules?.(rest)
      }
    }
    createFile('init', config)
  } catch (error) {
    logErr(error);
  }
};
