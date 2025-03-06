/**
 * @file applyTs2Js.js
 * @description use tsc to compile ts file
 * @author pipi(rzh881004@icloud.com)
 */
const { spawn } = require('child_process');
const tscCmd = require.resolve('typescript/bin/tsc');
const chalk = require("chalk");
const log = content => console.log(chalk.green(content));

module.exports = async function (srcDir, outDir) {
  return new Promise((resovle, reject) => {
    // generate tsc args
    const tscArgs = [
      '--project', srcDir,
      '--outDir', outDir,
      '--skipLibCheck',
    ];

    // use child_process to run tsc
    const tscProcess = spawn(tscCmd, tscArgs, { stdio: 'inherit' });

    tscProcess.on('close', (code) => {
      if (code === 0) {
        log('TypeScript compiled successfully');
        resovle(void 0)
      } else {
        console.error(`TypeScript compilation failed with exit code ${code}`);
        reject(`TypeScript compilation failed with exit code ${code}`)
      }
    });

    tscProcess.on('error', (err) => {
      console.error('Failed to start tsc process:', err);
      reject(err)
    });
  })
}