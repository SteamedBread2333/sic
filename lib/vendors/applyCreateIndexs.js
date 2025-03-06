/**
 * @file applyCreateEntry.js
 * @description create index.ts file
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

function camelCase(str) {
  return str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}

function generateIndexTsInDirectories(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach(dirent => {
    const filePath = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      const files = [];
      const subDirs = [];
      fs.readdirSync(filePath, { withFileTypes: true }).forEach(file => {
        if (file.isFile() && path.extname(file.name) === '.ts') {
          const fileName = path.basename(file.name, '.ts');
          files.push(fileName);
        } else if (file.isDirectory()) {
          subDirs.push(file.name);
        }
      });

      // generate import statements
      const importStatements = [];
      files.forEach(fileName => {
        if (fileName !== 'index') {
          importStatements.push(`import ${camelCase(fileName)} from './${fileName}';`);
        }
      });
      subDirs.forEach(subDir => {
        importStatements.push(`import ${camelCase(subDir)} from './${subDir}';`);
      });

      // generate export statements
      const exportStatement = `export default {\n  ${files.concat(subDirs.map(subDir => {
        return camelCase(subDir)
      })).map(name => {
        if (name !== 'index') {
          return `...${camelCase(name)}`
        }
      }).filter(name => !!name).join(',\n  ')}\n};`;
      const indexTsContent = `// This file is generated automatically\n${importStatements.join('\n')}\n\n${exportStatement}`;
      const indexTsPath = path.join(filePath, 'index.ts');
      fs.writeFileSync(indexTsPath, indexTsContent, 'utf8');
      log(`Generated index.ts files in ${indexTsPath}`);
      generateIndexTsInDirectories(filePath);
    }
  });
}

module.exports = async function (directoryPath) {
  generateIndexTsInDirectories(directoryPath);
}