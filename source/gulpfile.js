// 😄 This file is used to define Gulp tasks with source path and destination path. While gulp_includeNodeModules.js is used to save the functions for the build.

import gulp from 'gulp'
import path from 'path'
import filesystem from 'fs'
import config from 'configuration/configuration.js' // configuration
export const include = (file)=> { eval(filesystem.readFileSync(file) + '') } // Execute file code as if written locally.
export const joinPath = require(path.join(config.UtilityModulePath, 'joinPath.js')).default
export const source = subpath => { return joinPath(config.directory.SourceCodePath, subpath) }
export const destination = subpath => { return joinPath(config.directory.DestinationPath, subpath) }
export const plugins = require('gulp-load-plugins')({ camelize: true })
const gulpTaskExecution = require(path.join(config.UtilityModulePath, 'gulpTaskExecution.js')).default(gulp)

{	
	import { taskSetting as clientSideTaskSetting, taskAggregationSetting as clientsideTaskAggregationSetting } from './buildStepDefinition/clientSide.taskSetting.js'
	import { taskSetting as nativeTaskSetting, taskAggregationSetting as nativeTaskAggregationSetting } from './buildStepDefinition/native.taskSetting.js'
	import { taskSetting as polyfillTaskSetting, taskAggregationSetting as polyfillTaskAggregationSetting } from './buildStepDefinition/polyfill.taskSetting.js'
	import { taskSetting as serverSideTaskSetting, taskAggregationSetting as serverSideTaskAggregationSetting } from './buildStepDefinition/serverSide.taskSetting.js'

	// for registring Task functions
	let taskSetting = Array.prototype.concat(
		clientSideTaskSetting,
		nativeTaskSetting,
		polyfillTaskSetting,
		serverSideTaskSetting
	)
	// for executing task chain/aggregation
	let taskAggregationSetting = Array.prototype.concat(
		clientsideTaskAggregationSetting,
		nativeTaskAggregationSetting,
		polyfillTaskAggregationSetting,
		serverSideTaskAggregationSetting,
		[{
			name: 'build',
			executionType: 'series',
			childTask: [
				{
					label: 'serverSide:build'
				},
				{
					label: 'clientSide:build'
				},
				{
					label: 'nativeClientSide:build'
				}, 
				{
					label: 'polyfillClientSide:build'
				},
			]
		}]
	)

	gulpTaskExecution({ taskSetting, taskAggregationSetting }) // register tasks.

	// ⌚ Watch file changes from sources to destination folder.
	gulp.task('watch:source', ()=> {

		// assets
		gulp.watch(
			[
				source('**/*'),
				source('**/*')
			], 
			{interval: INTERVAL, usePolling: usePolling}, 
			gulp.series(
				gulp.parallel(
					// 'build:css'
				)
			)
		);

	});
}
const passedCommandArray /* Array */ = process.argv.slice(2) // this returns array of the passed tasks names.
gulp.parallel(passedCommandArray)() // execute tasks.
