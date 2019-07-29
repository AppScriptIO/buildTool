import { include, joinPath, source, destination, plugins } from '../script.js'
import path from 'path'
const config = require('../../configuration') // configuration
const prefix = config.distribution.clientSide.polyfill.prefix
const operationModulePath = path.normalize(__dirname, '../utility/operation')

export const dataItem = [
  {
    key: `${prefix}:copy:sourceCode`,
    data: {
      path: path.join(operationModulePath, 'rsync.js'),
      argument: {
        source: config.directory.clientSidePath,
        destination: destination(prefix),
        algorithm: 'sourceToSame',
        copyContentOnly: true,
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: `${prefix}:json`,
    data: {
      path: path.join(operationModulePath, 'transformAsset/json.js'),
      argument: {
        sources: [path.join(config.directory.clientSidePath, '/**/*.json'), '!' + path.join(config.directory.clientSidePath, '**/@package/**/*.json')],
        destination: destination(prefix),
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: `${prefix}:html`,
    data: {
      path: path.join(operationModulePath, 'transformAsset/html.js'),
      module: 'html',
      argument: {
        sources: [path.join(config.directory.clientSidePath, '/**/*.html'), '!' + path.join(config.directory.clientSidePath, '**/@package/**/*.html')],
        destination: destination(prefix),
        babelPath: config.directory.babelPath,
        babelConfigFileName: 'polyfillClientSideBuild.BabelConfig.js',
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: `${prefix}:stylesheet`,
    data: {
      path: path.join(operationModulePath, 'transformAsset/stylesheet.js'),
      argument: {
        sources: [path.join(config.directory.clientSidePath, '/**/*.css'), '!' + path.join(config.directory.clientSidePath, '**/@package/**/*.css')],
        destination: destination(prefix),
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: `${prefix}:javascript`,
    data: {
      path: path.join(operationModulePath, 'transformAsset/javascript.js'),
      module: 'clientJS',
      argument: {
        sources: [
          path.join(config.directory.clientSidePath, '/**/*.js'), // including package js to allow named import path transformation.
          '!' + path.join(config.directory.clientSidePath, '/**/@package/**/*.js'),
          path.join(config.directory.clientSidePath, '/**/webcomponent/@package/@polymer/**/*.js'),
          '!' + path.join(config.directory.clientSidePath, '/**/webcomponent/@package/@polymer/**/bower_components/**/*.js'), // polymer 3 contains a bower_components folder.
        ],
        destination: destination(prefix),
        babelPath: config.directory.babelPath,
        babelConfigFileName: 'polyfillClientSideBuild.BabelConfig.js',
        includeSourceMap: false,
      },
    },
    tag: {
      executionType: 'function',
    },
  },
]
