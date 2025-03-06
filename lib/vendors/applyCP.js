/**
 * @file applyCP.js
 * @description copy files
 * @author pipi(rzh881004@icloud.com)
 */
const fs = require('fs');
const path = require('path');

// copy file function
function copyFile(src, dest) {
  const readStream = fs.createReadStream(src);
  const writeStream = fs.createWriteStream(dest);
  readStream.pipe(writeStream);
}

module.exports = function copyFolder(src, dest, ignoredFiles = []) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const isIgnored = ignoredFiles.includes(entry.name);
    if (entry.isDirectory()) {
      copyFolder(srcPath, destPath, ignoredFiles);
    } else if (!isIgnored) {
      copyFile(srcPath, destPath);
    }
  }
}