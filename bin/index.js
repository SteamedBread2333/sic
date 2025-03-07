#!/usr/bin/env node
const program = require("commander");
const { init, xlsx, ts, langs } = require("../lib/inquirer");
const readConfig = require("../lib/vendors/applyReadConfig");

const config = readConfig('intl.config.ts');

// Show package version
program.version(require("../package.json").version);

program.command("init")
	.description("Init Work Space, Pulling Source Files")
	.action(() => init(config));

program.command("xlsx")
	.description("Generage Export File(.xlsx)")
	.action(() => {
		xlsx(config);
	});

program.command("ts")
	.description("Start import .xlsx File, and generate .ts files")
	.action(() => {
		ts(config);
	});

program.command("langs")
	.description("Show All Supported Languages")
	.action(() => {
		langs(config)
	});

program.parse(process.argv);