"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.pipeline = pipeline;exports.fragmentPipeline = void 0;var _gulpJsonminify = _interopRequireDefault(require("gulp-jsonminify"));
var _gulpSize = _interopRequireDefault(require("gulp-size"));

const fragmentPipeline = () => [(0, _gulpJsonminify.default)()];exports.fragmentPipeline = fragmentPipeline;

function pipeline() {
  return [...fragmentPipeline(), (0, _gulpSize.default)({ title: 'json' })];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS90cmFuc2Zvcm1QaXBlbGluZS9qc29uLmpzIl0sIm5hbWVzIjpbImZyYWdtZW50UGlwZWxpbmUiLCJwaXBlbGluZSIsInRpdGxlIl0sIm1hcHBpbmdzIjoiOE5BQUE7QUFDQTs7QUFFTyxNQUFNQSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsOEJBQUQsQ0FBL0IsQzs7QUFFQSxTQUFTQyxRQUFULEdBQW9CO0FBQ3pCLFNBQU8sQ0FBQyxHQUFHRCxnQkFBZ0IsRUFBcEIsRUFBd0IsdUJBQUssRUFBRUUsS0FBSyxFQUFFLE1BQVQsRUFBTCxDQUF4QixDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQganNvbk1pbmlmeSBmcm9tICdndWxwLWpzb25taW5pZnknXG5pbXBvcnQgc2l6ZSBmcm9tICdndWxwLXNpemUnXG5cbmV4cG9ydCBjb25zdCBmcmFnbWVudFBpcGVsaW5lID0gKCkgPT4gW2pzb25NaW5pZnkoKV1cblxuZXhwb3J0IGZ1bmN0aW9uIHBpcGVsaW5lKCkge1xuICByZXR1cm4gWy4uLmZyYWdtZW50UGlwZWxpbmUoKSwgc2l6ZSh7IHRpdGxlOiAnanNvbicgfSldXG59XG4iXX0=