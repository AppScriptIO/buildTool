"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipeline = pipeline;
exports.fragmentPipeline = void 0;

var _gulpSize = _interopRequireDefault(require("gulp-size"));

var _gulpImagemin = _interopRequireDefault(require("gulp-imagemin"));

const fragmentPipeline = () => [(0, _gulpImagemin.default)({
  progressive: true,
  interlaced: true
})];

exports.fragmentPipeline = fragmentPipeline;

function pipeline() {
  return [...fragmentPipeline(), (0, _gulpSize.default)({
    title: 'imageOptimizeTask'
  })];
}