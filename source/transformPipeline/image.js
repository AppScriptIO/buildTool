"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.pipeline = pipeline;exports.fragmentPipeline = void 0;var _gulpSize = _interopRequireDefault(require("gulp-size"));
var _gulpImagemin = _interopRequireDefault(require("gulp-imagemin"));

const fragmentPipeline = () => [(0, _gulpImagemin.default)({ progressive: true, interlaced: true })];exports.fragmentPipeline = fragmentPipeline;

function pipeline() {
  return [...fragmentPipeline(), (0, _gulpSize.default)({ title: 'imageOptimizeTask' })];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS90cmFuc2Zvcm1QaXBlbGluZS9pbWFnZS5qcyJdLCJuYW1lcyI6WyJmcmFnbWVudFBpcGVsaW5lIiwicHJvZ3Jlc3NpdmUiLCJpbnRlcmxhY2VkIiwicGlwZWxpbmUiLCJ0aXRsZSJdLCJtYXBwaW5ncyI6IjhOQUFBO0FBQ0E7O0FBRU8sTUFBTUEsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLDJCQUFTLEVBQUVDLFdBQVcsRUFBRSxJQUFmLEVBQXFCQyxVQUFVLEVBQUUsSUFBakMsRUFBVCxDQUFELENBQS9CLEM7O0FBRUEsU0FBU0MsUUFBVCxHQUFvQjtBQUN6QixTQUFPLENBQUMsR0FBR0gsZ0JBQWdCLEVBQXBCLEVBQXdCLHVCQUFLLEVBQUVJLEtBQUssRUFBRSxtQkFBVCxFQUFMLENBQXhCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzaXplIGZyb20gJ2d1bHAtc2l6ZSdcbmltcG9ydCBpbWFnZW1pbiBmcm9tICdndWxwLWltYWdlbWluJ1xuXG5leHBvcnQgY29uc3QgZnJhZ21lbnRQaXBlbGluZSA9ICgpID0+IFtpbWFnZW1pbih7IHByb2dyZXNzaXZlOiB0cnVlLCBpbnRlcmxhY2VkOiB0cnVlIH0pXVxuXG5leHBvcnQgZnVuY3Rpb24gcGlwZWxpbmUoKSB7XG4gIHJldHVybiBbLi4uZnJhZ21lbnRQaXBlbGluZSgpLCBzaXplKHsgdGl0bGU6ICdpbWFnZU9wdGltaXplVGFzaycgfSldXG59XG4iXX0=