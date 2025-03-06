#!/usr/bin/env node
const program = require("commander");
const { init, ['gen:export']: genExport, ['gen:locales']: genLocales, langs } = require("../lib/inquirer");

// Show package version
program.version(require("../package.json").version);

program.command("init")
	.description("Init Work Space, Pulling Source Files")
	.action(init);

program.command("gen:export")
	.description("Generage Export File(.xlsx)")
	.action(() => {
		genExport();
	});

program.command("gen:locales")
	.description("Start import .xlsx File")
	.action(() => {
		genLocales();
	});

program.command("langs")
	.description("Show All Supported Languages")
	.action(() => {
		langs()
	});

program.parse(process.argv);