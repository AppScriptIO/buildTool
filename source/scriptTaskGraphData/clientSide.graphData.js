import path from 'path'
import { include, joinPath, source, destination, plugins } from '../script.js'
const config = require('../../configuration')
const prefix = `clientSide`
const operationModulePath = path.normalize(__dirname, '../utility/operation')

export const dataItem = [
  {
    key: 'jspm',
    data: {
      path: path.join(operationModulePath, 'installPackage/jspm.js'),
      argument: {
        jspmPath: source('/packageManager/library.browser.jspm'),
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: 'webcomponent-yarn',
    data: {
      path: path.join(operationModulePath, 'installPackage/yarn.js'),
      argument: {
        yarnPath: source('/packageManager/webcomponent.browser.yarn/'),
      },
    },
    tag: {
      executionType: 'function',
    },
  },
  {
    key: 'library-yarn',
    data: {
      path: path.join(operationModulePath, 'installPackage/yarn.js'),
      argument: {
        yarnPath: source('/packageManager/library.browser.yarn/'),
      },
    },
    tag: {
      executionType: 'function',
    },
  },
]
