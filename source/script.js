// 😄 This file is used to define Gulp tasks with source path and destination path. While gulp_includeNodeModules.js is used to save the functions for the build.

import path from 'path'
import filesystem from 'fs'
import moduleSystem from 'module'
import util from 'util'
import stream from 'stream'
const pipeline = util.promisify(stream.pipeline);
import { execSync, spawn, spawnSync } from 'child_process'
import ownConfiguration from '../configuration'
import { src as readFileAsObjectStream, dest as writeFileFromObjectStream } from 'vinyl-fs'
import mergeStream from 'merge-stream'
// export const include = (file)=> { eval(filesystem.readFileSync(file) + '') } // Execute file code as if written locally.
// export const joinPath = require(path.join(config.UtilityModulePath, 'joinPath.js')).default
// export const source = subpath => { return joinPath(config.directory.SourceCodePath, subpath) }
// export const destination = subpath => { return joinPath(config.directory.DestinationPath, subpath) }
// export const plugins = require('gulp-load-plugins')({ camelize: true })
// const gulpTaskExecution = require(path.join(config.UtilityModulePath, 'gulpTaskExecution.js')).default(gulp)

// import { taskSetting as clientSideTaskSetting, taskAggregationSetting as clientsideTaskAggregationSetting } from './taskDataDefinition/clientSide.taskSetting.js'
// import { taskSetting as nativeTaskSetting, taskAggregationSetting as nativeTaskAggregationSetting } from './taskDataDefinition/native.taskSetting.js'
// import { taskSetting as polyfillTaskSetting, taskAggregationSetting as polyfillTaskAggregationSetting } from './taskDataDefinition/polyfill.taskSetting.js'
// import { taskSetting as serverSideTaskSetting, taskAggregationSetting as serverSideTaskAggregationSetting } from './taskDataDefinition/serverSide.taskSetting.js'

import { pipeline as cssPipeline } from './utility/operation/transformAsset/stylesheet.js'
import { serverJSPipeline } from './utility/operation/transformAsset/javascript.js'
import { pipeline as htmlPipeline } from './utility/operation/transformAsset/html.js'

export async function build({ targetProject }){
    const targetProjectRoot = targetProject.configuration.rootPath

	// const mergedFiles = mergeStream(sources, dependencies)
	// execute stream pipes instead of tasks.

	await pipeline(
		readFileAsObjectStream([path.join(targetProjectRoot, '*.css')]),
		...cssPipeline(),
		writeFileFromObjectStream(path.join(targetProjectRoot, 'output'))
	)

	await pipeline(
		readFileAsObjectStream([path.join(targetProjectRoot, '*.js')])
		...serverJSPipeline(),
		writeFileFromObjectStream(path.join(targetProjectRoot, 'output'))
	)

	// // for registring Task functions
	// let taskSetting = Array.prototype.concat(
	// 	clientSideTaskSetting,
	// 	nativeTaskSetting,
	// 	polyfillTaskSetting,
	// 	serverSideTaskSetting
	// )
	// // for executing task chain/aggregation
	// let taskAggregationSetting = Array.prototype.concat(
	// 	clientsideTaskAggregationSetting,
	// 	nativeTaskAggregationSetting,
	// 	polyfillTaskAggregationSetting,
	// 	serverSideTaskAggregationSetting,
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

	// gulpTaskExecution({ taskSetting, taskAggregationSetting }) // register tasks.

	// gulp.parallel([ 'build' ])() // execute tasks.
}