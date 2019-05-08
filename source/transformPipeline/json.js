"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipeline = pipeline;
exports.fragmentPipeline = void 0;

var _gulpJsonminify = _interopRequireDefault(require("gulp-jsonminify"));

var _gulpSize = _interopRequireDefault(require("gulp-size"));

const fragmentPipeline = () => [(0, _gulpJsonminify.default)()];

exports.fragmentPipeline = fragmentPipeline;

function pipeline() {
  return [...fragmentPipeline(), (0, _gulpSize.default)({
    title: 'json'
  })];
}