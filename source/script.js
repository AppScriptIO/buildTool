"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util"));

var _stream = _interopRequireDefault(require("stream"));

var _globby = _interopRequireDefault(require("globby"));

// 😄 This file is used to define Gulp tasks with source path and destination path. While gulp_includeNodeModules.js is used to save the functions for the build.
const pipeline = _util.default.promisify(_stream.default.pipeline);

async function build({
  targetProject
}) {
  const targetProjectRoot = targetProject.configuration.rootPath;
  let cssFileArray = await (0, _globby.default)(_path.default.join(targetProjectRoot, '*.css')),
      jsFileArray = await (0, _globby.default)(_path.default.join(targetProjectRoot, '*.js')),
      htmlFileArray = await (0, _globby.default)(_path.default.join(targetProjectRoot, '*.html'));

  const destinationPath = _path.default.join(targetProjectRoot, 'output'); // await pipeline(
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