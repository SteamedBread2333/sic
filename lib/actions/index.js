const init = require("./init");
const genExport = require("./genExport");
const genLocales = require("./genLocales");
const langs = require("./langs");

module.exports = {
	init,
	"gen:export": genExport,
	"gen:locales": genLocales,
	langs
};