const path = require('path')

const ownConfiguration = {
  directory: {
    root: path.resolve(`${__dirname}/..`),
    get source() {
      return path.join(ownConfiguration.directory.root, './source')
    },
    get distribution() {
      return path.join(ownConfiguration.directory.root, './distribution')
    },
    // get compiled() {
    //   return path.join(ownConfiguration.directory.root, './distribution')
    // }
  },
  entrypoint: {
    programmaticAPI: './script.js',
  },
  transpilation: {
    babelConfigKey: 'serverRuntime.BabelConfig.js',
    get babelConfig() {
      const { getBabelConfig } = require('@dependency/javascriptTranspilation')
      return getBabelConfig(ownConfiguration.transpilation.babelConfigKey, { configType: 'json' })
    },
  },
}

module.exports = Object.assign({}, ownConfiguration)
