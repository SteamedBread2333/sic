#!/usr/bin/env node
const chalk = require("chalk");
const logErr = content => console.log(chalk.red(content));

const createFile = require("..");

module.exports = async () => {
	try {
		createFile('langs')
	} catch (error) {
		logErr(error);
	}
};
