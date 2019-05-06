"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fragmentPipeline = fragmentPipeline;
exports.clientJSPipeline = clientJSPipeline;
exports.serverJSPipeline = serverJSPipeline;
exports.jsFileRegex = void 0;

var _gulpSourcemaps = _interopRequireDefault(require("gulp-sourcemaps"));

var _fragmentIndentationObjectStream = require("@dependency/fragmentIndentationObjectStream");

var _gulpBabel = _interopRequireDefault(require("gulp-babel"));

var _gulpDebug = _interopRequireDefault(require("gulp-debug"));

var _gulpSize = _interopRequireDefault(require("gulp-size"));

var _javascriptTranspilation = require("@dependency/javascriptTranspilation");

const jsFileRegex = /\.js$/;
exports.jsFileRegex = jsFileRegex;

function fragmentPipeline({
  babelPreset,
  babelPlugin,
  // babel configurations
  shouldSourceMap = true
}) {
  let pipeline = [(0, _gulpBabel.default)({
    "presets": babelPreset,
    "plugins": babelPlugin,
    "babelrc": false
  })];

  if (shouldSourceMap) {
    pipeline.unshift(_gulpSourcemaps.default.init());
    pipeline.push(_gulpSourcemaps.default.write('.'));
  }

  return pipeline;
}

function clientJSPipeline({
  babelConfigFileName = 'nativeClientSideBuild.BabelConfig.js'
} = {}) {
  const babelConfig = (0, _javascriptTranspilation.getBabelConfig)(babelConfigFileName);
  let pipeline = [(0, _gulpDebug.default)({
    title: 'clientJS:'
  }), _fragmentIndentationObjectStream.FragmentIndentation.TransformToFragmentKeys(), ...fragmentPipeline({
    babelPreset: babelConfig.presets,
    babelPlugin: babelConfig.plugins,
    shouldSourceMap: true
  }), // previous error handling - .pipe().on('error', function(e) { console.log('>>> ERROR', e); this.emit('end'); })
  _fragmentIndentationObjectStream.FragmentIndentation.TransformBackToFragment(), (0, _gulpSize.default)({
    title: `JAVASCRIPT - clientJS using ${babelConfigFileName}`
  })];
  return pipeline;
}

function serverJSPipeline({
  babelConfigFileName = 'serverBuild.BabelConfig.js'
} = {}) {
  const babelConfig = (0, _javascriptTranspilation.getBabelConfig)(babelConfigFileName);
  return [...fragmentPipeline({
    babelPreset: babelConfig.presets,
    babelPlugin: babelConfig.plugins,
    shouldSourceMap: true
  }), (0, _gulpSize.default)({
    title: 'Javascript - serverJS'
  })];
}