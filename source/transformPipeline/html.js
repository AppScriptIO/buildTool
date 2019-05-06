"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipeline = pipeline;
exports.fragmentPipeline = exports.htmlFileRegex = void 0;

var _gulpIf = _interopRequireDefault(require("gulp-if"));

var _gulpSize = _interopRequireDefault(require("gulp-size"));

var _gulpHtmlmin = _interopRequireDefault(require("gulp-htmlmin"));

var _polymerBuild = require("polymer-build");

var _fragmentIndentationObjectStream = require("@dependency/fragmentIndentationObjectStream");

var _stylesheet = require("./stylesheet.js");

var _javascript = require("./javascript.js");

const fragmentRegex = {
  ignoreCustomFragments: [/{%[\s\S]*?%}/, /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/],
  hbAttrWrap: {
    open: /\{\{(#|\^)[^}]+\}\}/,
    close: /\{\{\/[^}]+\}\}/
  }
};
const htmlFileRegex = /\.html$/; // for html fragments only, without css and js parts.

exports.htmlFileRegex = htmlFileRegex;

const fragmentPipeline = () => [(0, _gulpHtmlmin.default)({
  collapseWhitespace: true,
  removeComments: true,
  removeCommentsFromCDATA: true,
  minifyURLs: true,
  minifyJS: true,
  minifyCSS: true,
  ignoreCustomFragments: fragmentRegex.ignoreCustomFragments
})];

exports.fragmentPipeline = fragmentPipeline;

function pipeline({
  // array of file object streams (vinyl transformers)
  jsPipeline = (0, _javascript.clientJSPipeline)(),
  cssPipeline = (0, _stylesheet.pipeline)(),
  htmlPipeline = fragmentPipeline()
} = {}) {
  const sourcesHtmlSplitter = new _polymerBuild.HtmlSplitter();
  return [// Split
  _fragmentIndentationObjectStream.FragmentIndentation.TransformToFragmentKeys(), // temporarly remove server side indentation e.g. server side template indentations
  sourcesHtmlSplitter.split(), // split inline JS & CSS out into individual .js & .css files
  (0, _gulpIf.default)(_javascript.jsFileRegex, ...jsPipeline),
  /* HTML (also minimize any left or non detected sections - css, js, html tags that were not separated), e.g. css's transform property  */
  (0, _gulpIf.default)(htmlFileRegex, ...htmlPipeline),
  /* CSS */
  (0, _gulpIf.default)(_stylesheet.cssFileRegex, ...cssPipeline), // Re-join those files back into their original location
  sourcesHtmlSplitter.rejoin(), _fragmentIndentationObjectStream.FragmentIndentation.TransformBackToFragment(), (0, _gulpSize.default)({
    title: `HTML`
  })];
}