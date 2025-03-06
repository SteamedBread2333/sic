/**
 * @file applyDiffFiles.js
 * @description diff two directories and return the diff result
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');

// collect all ts files in a directory
function traverseDirForTsFiles(dirPath, baseDir, type = 'ts') {
  const tsFiles = [];
  fs.readdirSync(dirPath, { withFileTypes: true }).forEach(file => {
    const filePath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      tsFiles.push(...traverseDirForTsFiles(filePath, baseDir));
    } else if (file.isFile() && file.name.endsWith(type)) {
      tsFiles.push(path.relative(baseDir, filePath));
    }
  });
  return tsFiles;
}

// compare two directories and return the diff result
module.exports = async function diffTsFiles(folderA, folderB) {
  const tsFilesInA = traverseDirForTsFiles(folderA, folderA);
  const tsFilesInB = traverseDirForTsFiles(folderB, folderB);

  const deletedFiles = [];
  const changedFiles = [];
  const newFiles = tsFilesInB.filter(tsFilePath => !tsFilesInA.includes(tsFilePath));
  tsFilesInA.forEach(tsFilePath => {
    if (!tsFilesInB.includes(tsFilePath)) {
      deletedFiles.push(tsFilePath);
    } else if (fs.readFileSync(path.join(folderA, tsFilePath), 'utf8') !== fs.readFileSync(path.join(folderB, tsFilePath), 'utf8')) {
      changedFiles.push(tsFilePath);
    }
  });

  return { deletedFiles, newFiles, changedFiles };
}