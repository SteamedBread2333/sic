const { promisify } = require("util");
const figlet = promisify(require("figlet"));
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

const actions = require("./actions");

module.exports = async (type, param) => {
	const data = await figlet("Smoking Intl Cli");
	log(data);

	actions[type](param);
};