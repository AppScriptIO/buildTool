"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipeline = pipeline;
exports.fragmentPipeline = exports.cssFileRegex = void 0;

var _gulpPlumber = _interopRequireDefault(require("gulp-plumber"));

var _gulpSize = _interopRequireDefault(require("gulp-size"));

var _gulpCleanCss = _interopRequireDefault(require("gulp-clean-css"));

const cssSlam = require('css-slam');

// Other browesers configuration :
// var AUTOPREFIXER_BROWSERS = ['last 2 versions', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];
let AUTOPREFIXER_BROWSERS = ['ie >= 10', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4.4', 'bb >= 10'];
const cssFileRegex = /\.css$/;
exports.cssFileRegex = cssFileRegex;

const fragmentPipeline = () => [// wrapped with function to produce a separate instance on invocation
cssSlam.gulp(), (0, _gulpCleanCss.default)()];

exports.fragmentPipeline = fragmentPipeline;

function pipeline() {
  return [(0, _gulpPlumber.default)(), // autoprefixer({
  //   browsers: AUTOPREFIXER_BROWSERS,
  //   cascade: false
  ...fragmentPipeline(), (0, _gulpSize.default)({
    title: 'CSS'
  })];
}