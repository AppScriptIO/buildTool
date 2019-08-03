const projectConfig = require('../../configuration'),
  path = require('path'),
  filesystem = require('fs')

// • Run
if (filesystem.existsSync(projectConfig.directory.distribution)) {
  module.exports = require(projectConfig.directory.distribution)
} else {
  // • Transpilation (babelJSCompiler)
  const { Compiler } = require('@dependency/javascriptTranspilation')
  let compiler = new Compiler({ callerPath: __dirname, debugKey: __dirname })
  compiler.requireHook()
  module.exports = require(path.join(projectConfig.directory.source, projectConfig.entrypoint.programmaticAPI))
  // process.on('exit', () => {
  //   console.log(compiler.loadedFiles.map(value => value.filename))
  //   console.log(compiler.babelRegisterConfig.ignore)
  // })
}
