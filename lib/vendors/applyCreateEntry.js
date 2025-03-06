/**
 * @file applyCreateEntry.js
 * @description create entry file
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

function toSnakeCase(str) {
  return str.replace(/-/g, '_').toLowerCase();
}

module.exports = async function (outDir, languages) {
  languages.forEach(langDir => {
    const outputContent = [
      '// This file is generated automatically',
      `import ${toSnakeCase(langDir)} from './${langDir}/index'`,
      '',
      `export default ${toSnakeCase(langDir)}`,
    ].join('\n');
    const outputPath = path.join(outDir, `${langDir}.ts`);
    fs.writeFileSync(outputPath, outputContent);
    log(`Generated ${outputPath}`);
  });
}