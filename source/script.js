// 😄 This file is used to define Gulp tasks with source path and destination path. While gulp_includeNodeModules.js is used to save the functions for the build.

import path from 'path'
import filesystem from 'fs'
import util from 'util'
import stream from 'stream'
const pipeline = util.promisify(stream.pipeline)
import mergeStream from 'merge-stream'
import { src as readFileAsObjectStream, dest as writeFileFromObjectStream } from 'vinyl-fs'
import wildcardPathnameMatcher from 'globby'
import ownConfiguration from '../configuration'

// export const source = subpath => { return joinPath(config.directory.SourceCodePath, subpath) }
// export const destination = subpath => { return joinPath(config.directory.DestinationPath, subpath) }
// const gulpTaskExecution = require(path.join(config.UtilityModulePath, 'gulpTaskExecution.js')).default(gulp)

// import {dataItem as clientSideDataItem, node as clientsideNode } from './taskDataDefinition/clientSide.taskSetting.js'
// import {dataItem as nativeDataItem, node as nativeNode } from './taskDataDefinition/native.taskSetting.js'
// import {dataItem as polyfillDataItem, node as polyfillNode } from './taskDataDefinition/polyfill.taskSetting.js'
// import {dataItem as serverSideDataItem, node as serverSideNode } from './taskDataDefinition/serverSide.taskSetting.js'

import { pipeline as cssPipeline } from './utility/operation/transformAsset/stylesheet.js'
import { serverJSPipeline } from './utility/operation/transformAsset/javascript.js'
import { pipeline as htmlPipeline } from './utility/operation/transformAsset/html.js'
import { installNpm } from './utility/operation/installPackage/install-npm.js'
import { recursivelySyncFile } from './utility/operation/manipulateFile/synchronizeFile.js'

export async function build({ targetProject }) {
  const targetProjectRoot = targetProject.configuration.rootPath

  let cssFileArray = await wildcardPathnameMatcher(path.join(targetProjectRoot, '*.css')),
    jsFileArray = await wildcardPathnameMatcher(path.join(targetProjectRoot, '*.js')),
    htmlFileArray = await wildcardPathnameMatcher(path.join(targetProjectRoot, '*.html'))
  const destinationPath = path.join(targetProjectRoot, 'output')

  // await pipeline(
  // 	readFileAsObjectStream(cssFileArray),
  // 	...cssPipeline(),
  // 	writeFileFromObjectStream(destinationPath)
  // )

  // await pipeline(
  // 	readFileAsObjectStream(jsFileArray),
  // 	...serverJSPipeline(),
  // 	writeFileFromObjectStream(destinationPath)
  // )

  // await pipeline(
  // 	readFileAsObjectStream(htmlFileArray),
  // 	...htmlPipeline(),
  // 	writeFileFromObjectStream(destinationPath)
  // )

  // await installNpm({ npmPath: path.join(targetProjectRoot, 'input/') })

  // await recursivelySyncFile({
  // 	source: path.join(targetProjectRoot, 'input'),
  // 	destination: path.join(targetProjectRoot, 'output/rsync2'),
  // 	copyContentOnly: true
  // })

  // // for registring Task functions
  // letdataItem = Array.prototype.concat(
  // 	clientSideDataItem,
  // 	nativeDataItem,
  // 	polyfillDataItem,
  // 	serverSideDataItem
  // )
  // // for executing task chain/aggregation
  // let node = Array.prototype.concat(
  // 	clientsideNode,
  // 	nativeNode,
  // 	polyfillNode,
  // 	serverSideNode,
  // 	[{
  // 		name: 'build',
  // 		executionType: 'series',
  // 		childTask: [
  // 			{
  // 				label: 'serverSide:build'
  // 			},
  // 			{
  // 				label: 'clientSide:build'
  // 			},
  // 			{
  // 				label: 'nativeClientSide:build'
  // 			},
  // 			{
  // 				label: 'polyfillClientSide:build'
  // 			},
  // 		]
  // 	}]
  // )

  // gulpTaskExecution({dataItem, node }) // register tasks.

  // gulp.parallel([ 'build' ])() // execute tasks.
}
