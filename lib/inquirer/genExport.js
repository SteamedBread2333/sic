#!/usr/bin/env node
const chalk = require("chalk");
const readConfig = require("../vendors/applyReadConfig")
const log = content => console.log(chalk.green(content));
const logErr = content => console.log(chalk.red(content));

const createFile = require("..");

module.exports = async () => {
	log("Start generate .xlsx file");
	try {
		const config = readConfig('intl.config.ts');
		const { spaceDir, languages, exportFilePath, sheetMode } = config || {};
		createFile("gen:export", {
			spaceDir, languages, exportFilePath, sheetMode
		});
	} catch (error) {
		logErr(error);
	}
};