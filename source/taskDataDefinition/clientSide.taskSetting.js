import { include, joinPath, source, destination, plugins } from '../script.js'
import path from 'path'
const config = require('../../configuration/configuration.js') // configuration
const prefix = `clientSide`
const operationModulePath = path.normalize(__dirname, '../utility/operation')

export const taskAggregationSetting = [
    {
        name: `${prefix}:install:dependencies`,
        executionType: 'parallel',
        childTask: [
            { label: 'jspm' },
            { label: 'webcomponent-yarn' },
            { label: 'library-yarn' },
        ]
    },
    {
        name: `${prefix}:build`,
        executionType: 'series',
        childTask: [
            { label: `${prefix}:install:dependencies` },
        ]
    },

]

export const taskSetting = [
    {
        key: 'jspm',
        data: {
            path: path.join(operationModulePath, 'installPackage/jspm.js'),
            argument: {
                nodejsVersion: process.version,
                jspmLocation: source('/packageManager/library.browser.jspm')
            }
        }
    },
    {
        key: 'webcomponent-yarn',
        data: {
            path: path.join(operationModulePath, 'installPackage/yarn.js'),
            argument: {
				yarnPath: source('/packageManager/webcomponent.browser.yarn/')
            }
        }
    },
    {
        key: 'library-yarn',
        data: {
            path: path.join(operationModulePath, 'installPackage/yarn.js'),
            argument: {
				yarnPath: source('/packageManager/library.browser.yarn/')
            }
        }
    },

]