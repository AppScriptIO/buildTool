import { include, joinPath, source, destination, plugins } from '../script.js'
import path from 'path'
const config = require('../../configuration') // configuration
const prefix = 'serverSide'
const operationModulePath = path.normalize(__dirname, '../utility/operation')

export const dataItem = [
  {
    key: `${prefix}:install:yarn`,
    data: {
      path: path.join(operationModulePath, 'installPackage/yarn.js'),
      argument: {
        yarnPath: source('/packageManager/library.server.yarn/'),
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: `${prefix}:copy:serverSide`,
    data: {
      path: path.join(operationModulePath, 'rsync.js'),
      argument: {
        source: config.directory.serverSidePath,
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
    key: `${prefix}:copy:databaseData`,
    data: {
      path: path.join(operationModulePath, 'rsync.js'),
      argument: {
        source: source('databaseData'),
        destination: destination(),
        algorithm: 'sourceToSame',
        copyContentOnly: false,
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: `${prefix}:transpile:databaseData`,
    data: {
      path: path.join(operationModulePath, 'assetBuild/javascript.js'),
      module: 'serverJS',
      argument: {
        sources: [source('databaseData/**/*.js'), '!' + source('databaseData/node_modules/**/*.js')],
        destination: destination('databaseData/'),
        babelPath: config.directory.babelPath,
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: `${prefix}:transpile:serverSide`,
    data: {
      path: path.join(operationModulePath, 'assetBuild/javascript.js'),
      module: 'serverJS',
      argument: {
        sources: [path.join(config.directory.serverSidePath, '**/*.js'), '!' + source('serverSide/node_modules/**/*.js')],
        destination: destination('serverSide/'),
        babelPath: config.directory.babelPath,
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: `${prefix}:transpile:appscript`,
    data: {
      path: path.join(operationModulePath, 'assetBuild/javascript.js'),
      module: 'serverJS',
      argument: {
        sources: [path.join(config.directory.serverSidePath, 'node_modules/appscript/**/*.js'), '!' + path.join(config.directory.serverSidePath, 'node_modules/appscript/node_modules/**/*.js')],
        destination: destination('serverSide/node_modules/appscript'),
        babelPath: config.directory.babelPath,
      },
    },
    tag: {
      executionType: 'function',
    },
  },
]
