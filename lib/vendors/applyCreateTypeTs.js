/**
 * @file applyCreateTypeTs.js
 * @description create typings.d.ts file
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

module.exports = async function (outDir, languages) {
  const defaultExportLocale = languages[0] || 'en-US'
  const typingsFilePath = path.join(outDir, 'typings.d.ts');
  // generate typings.d.ts content
  let typingsContent = `// eslint-disable-next-line @typescript-eslint/consistent-type-imports
declare type I18nIdTypes = keyof typeof import('./${defaultExportLocale}').default
`;
  fs.writeFileSync(typingsFilePath, typingsContent);
  log(`Generated typings.d.ts file in ${typingsFilePath}`);
}