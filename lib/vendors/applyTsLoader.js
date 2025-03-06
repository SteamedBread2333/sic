/**
 * @file applyTsLoader.js
 * @description use v8 to load ts file
 * @author pipi(rzh881004@icloud.com)
 */
const ts = require('typescript');
const vm = require('vm');
const fs = require('fs');
const path = require('path');

module.exports = function (tsFilePath) {
  const tsContent = fs.readFileSync(tsFilePath, 'utf8');

  // Create a virtual context that mimics the global environment of Node.js
  const context = {
    module: {},
    exports: {},
    require: require,
    console,
    process: process,
    __dirname,
    __filename,
  };

  // Compile the TypeScript file content
  const options = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2015,
    strict: true,
  };

  // Use TypeScript compiler API to compile the file
  const result = ts.transpileModule(tsContent, {
    compilerOptions: options,
    fileName: path.basename(tsFilePath),
  });

  // Get the compiled JavaScript code
  const jsContent = result.outputText;

  // Create a script from the compiled JavaScript code
  const script = new vm.Script(jsContent, { filename: tsFilePath });

  // Run the script in the virtual context
  const compiledModule = script.runInNewContext(context);

  // If the TypeScript file exports an object, you can access it directly
  return compiledModule
}