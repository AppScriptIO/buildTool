const projectConfig = require('../../configuration'),
  path = require('path'),
  filesystem = require('fs')

// • Run
if (filesystem.existsSync(projectConfig.directory.distribution)) {
  module.exports = require(projectConfig.directory.distribution)
} else {
  // • Transpilation (babelJSCompiler)
  const { Compiler } = require('@dependency/javascriptTranspilation')
  let compiler = new Compiler({ callerPath: __dirname, babelConfig: {ignore: [] /*override default ignore list*/} })
  compiler.requireHook({ restrictToTargetProject: false }) // `restrictToTargetProject` is off for fixing an issue in circular dependencies when this package and it's dependencies symlink each other.
  module.exports = require(path.join(projectConfig.directory.source, projectConfig.entrypoint.programmaticAPI))
  // process.on('exit', () => {
  //   console.log(compiler.loadedFiles.map(value => value.filename))
  //   console.log(compiler.babelRegisterConfig.ignore)
  // })
}
