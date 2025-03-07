#!/usr/bin/env node
const chalk = require("chalk");
const readConfig = require("../vendors/applyReadConfig")
const log = content => console.log(chalk.green(content));
const logErr = content => console.log(chalk.red(content));

const createFile = require("..");

module.exports = async (config = {}) => {
	log("Start generate .xlsx file");
	try {
		createFile("xlsx", config);
	} catch (error) {
		logErr(error);
	}
};