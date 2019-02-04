// 😄 This file is used to define Gulp tasks with source path and destination path. While gulp_includeNodeModules.js is used to save the functions for the build.

import gulp from 'gulp'
import path from 'path'
import filesystem from 'fs'
const moduleSystem = require('module')
const { execSync, spawn, spawnSync } = require('child_process')
import config from '../configuration/configuration.js'
export const include = (file)=> { eval(filesystem.readFileSync(file) + '') } // Execute file code as if written locally.
export const joinPath = require(path.join(config.UtilityModulePath, 'joinPath.js')).default
export const source = subpath => { return joinPath(config.directory.SourceCodePath, subpath) }
export const destination = subpath => { return joinPath(config.directory.DestinationPath, subpath) }
export const plugins = require('gulp-load-plugins')({ camelize: true })
const gulpTaskExecution = require(path.join(config.UtilityModulePath, 'gulpTaskExecution.js')).default(gulp)

import { taskSetting as clientSideTaskSetting, taskAggregationSetting as clientsideTaskAggregationSetting } from './taskDataDefinition/clientSide.taskSetting.js'
import { taskSetting as nativeTaskSetting, taskAggregationSetting as nativeTaskAggregationSetting } from './taskDataDefinition/native.taskSetting.js'
import { taskSetting as polyfillTaskSetting, taskAggregationSetting as polyfillTaskAggregationSetting } from './taskDataDefinition/polyfill.taskSetting.js'
import { taskSetting as serverSideTaskSetting, taskAggregationSetting as serverSideTaskAggregationSetting } from './taskDataDefinition/serverSide.taskSetting.js'

export function build({ targetProject }){
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

	gulp.parallel([ 'build' ])() // execute tasks.
}