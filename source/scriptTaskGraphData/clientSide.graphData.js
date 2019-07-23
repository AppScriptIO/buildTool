import path from 'path'
import { include, joinPath, source, destination, plugins } from '../script.js'
const config = require('../../configuration')
const prefix = `clientSide`
const operationModulePath = path.normalize(__dirname, '../utility/operation')

export const node = [
  {
    key: `${prefix}:install:dependencies`,
    connection: [
      {
        key: 'connection-key-1', // pathPointerKey
        source: {
          position: {
            order: '1',
            // or
            // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-1',
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
      {
        key: 'connection-key-2', // pathPointerKey
        source: {
          position: {
            order: '2',
            // or
            // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-2',
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
      {
        key: 'connection-key-3', // pathPointerKey
        source: {
          position: {
            order: '3',
            // or
            // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-3',
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
    ],
    tag: {
      traversalImplementationType: 'logNode',
      iterateConnectionImplementation: 'allPromise', // parallel
    },
  },
  {
    key: `${prefix}:build`,
    connection: [
      {
        key: 'connection-key-1', // pathPointerKey
        source: {
          position: {
            order: '1',
            // or
            // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }
          },
        },
        destination: {
          node: [
            {
              key: `${prefix}:install:dependencies`,
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
    ],
    tag: {
      traversalImplementationType: 'logNode',
      iterateConnectionImplementation: 'chronological',
    },
  },
  {
    key: 'node-key-1',
    dataItem: {
      key: 'jspm',
    },
    tag: {
      dataItemType: 'reference',
      executionType: 'log',
    },
  },
  {
    key: 'node-key-2',
    dataItem: {
      key: 'webcomponent-yarn',
    },
    tag: {
      dataItemType: 'reference',
      executionType: 'log',
    },
  },
  {
    key: 'node-key-3',
    dataItem: {
      key: 'library-yarn',
    },
    tag: {
      dataItemType: 'reference',
      executionType: 'log',
    },
  },
]

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
