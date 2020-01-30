"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.shouldTranspile = void 0;var _assert = _interopRequireDefault(require("assert"));
var _path = _interopRequireDefault(require("path"));
const normalizeArray = array => array.map(p => _path.default.normalize(p));








const shouldTranspile = ({ node, traverser, traverseCallContext }) => {var _traverser$context, _traverser$context2, _targetNode$propertie, _ref, _ref2, _targetProjectConfig$;
  let targetNode = traverseCallContext.targetNode ? traverseCallContext.targetNode : node;

  let argumentObject = (_traverser$context = traverser.context) === null || _traverser$context === void 0 ? void 0 : _traverser$context.argumentObject;
  let targetProjectConfig = (_traverser$context2 = traverser.context) === null || _traverser$context2 === void 0 ? void 0 : _traverser$context2.targetProjectConfig;
  (0, _assert.default)(targetProjectConfig, `• traverser.context "targetProjectConfig" variable is required to run project dependent conditions.`);
  let currentNodeDirectory = ((_targetNode$propertie = targetNode.properties) === null || _targetNode$propertie === void 0 ? void 0 : _targetNode$propertie.relativePath) && _path.default.normalize(targetNode.properties.relativePath);
  (0, _assert.default)(currentNodeDirectory, `• relativePath must exist on stage targetNode that uses this condition for evaluation.`);
  let parameterCompileArray = (_ref = (argumentObject === null || argumentObject === void 0 ? void 0 : argumentObject.compile) || [], normalizeArray(_ref));
  let configCompileArray = (_ref2 = ((_targetProjectConfig$ = targetProjectConfig.build) === null || _targetProjectConfig$ === void 0 ? void 0 : _targetProjectConfig$.compile) || [], normalizeArray(_ref2));

  return [...parameterCompileArray, ...configCompileArray].includes(currentNodeDirectory);
};exports.shouldTranspile = shouldTranspile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9mdW5jdGlvbi9jb25kaXRpb24uanMiXSwibmFtZXMiOlsibm9ybWFsaXplQXJyYXkiLCJhcnJheSIsIm1hcCIsInAiLCJwYXRoIiwibm9ybWFsaXplIiwic2hvdWxkVHJhbnNwaWxlIiwibm9kZSIsInRyYXZlcnNlciIsInRyYXZlcnNlQ2FsbENvbnRleHQiLCJ0YXJnZXROb2RlIiwiYXJndW1lbnRPYmplY3QiLCJjb250ZXh0IiwidGFyZ2V0UHJvamVjdENvbmZpZyIsImN1cnJlbnROb2RlRGlyZWN0b3J5IiwicHJvcGVydGllcyIsInJlbGF0aXZlUGF0aCIsInBhcmFtZXRlckNvbXBpbGVBcnJheSIsImNvbXBpbGUiLCJjb25maWdDb21waWxlQXJyYXkiLCJidWlsZCIsImluY2x1ZGVzIl0sIm1hcHBpbmdzIjoiaU1BQUE7QUFDQTtBQUNBLE1BQU1BLGNBQWMsR0FBR0MsS0FBSyxJQUFJQSxLQUFLLENBQUNDLEdBQU4sQ0FBVUMsQ0FBQyxJQUFJQyxjQUFLQyxTQUFMLENBQWVGLENBQWYsQ0FBZixDQUFoQzs7Ozs7Ozs7O0FBU08sTUFBTUcsZUFBZSxHQUFHLENBQUMsRUFBRUMsSUFBRixFQUFRQyxTQUFSLEVBQW1CQyxtQkFBbkIsRUFBRCxLQUE4QztBQUMzRSxNQUFJQyxVQUFVLEdBQUdELG1CQUFtQixDQUFDQyxVQUFwQixHQUFpQ0QsbUJBQW1CLENBQUNDLFVBQXJELEdBQWtFSCxJQUFuRjs7QUFFQSxNQUFJSSxjQUFjLHlCQUFHSCxTQUFTLENBQUNJLE9BQWIsdURBQUcsbUJBQW1CRCxjQUF4QztBQUNBLE1BQUlFLG1CQUFtQiwwQkFBR0wsU0FBUyxDQUFDSSxPQUFiLHdEQUFHLG9CQUFtQkMsbUJBQTdDO0FBQ0EsdUJBQU9BLG1CQUFQLEVBQTZCLHFHQUE3QjtBQUNBLE1BQUlDLG9CQUFvQixHQUFHLDBCQUFBSixVQUFVLENBQUNLLFVBQVgsZ0ZBQXVCQyxZQUF2QixLQUF1Q1osY0FBS0MsU0FBTCxDQUFlSyxVQUFVLENBQUNLLFVBQVgsQ0FBc0JDLFlBQXJDLENBQWxFO0FBQ0EsdUJBQU9GLG9CQUFQLEVBQThCLHdGQUE5QjtBQUNBLE1BQUlHLHFCQUFxQixXQUFHLENBQUFOLGNBQWMsU0FBZCxJQUFBQSxjQUFjLFdBQWQsWUFBQUEsY0FBYyxDQUFFTyxPQUFoQixLQUEyQixFQUE5QixFQUFvQ2xCLGNBQXBDLE9BQXpCO0FBQ0EsTUFBSW1CLGtCQUFrQixZQUFHLDBCQUFBTixtQkFBbUIsQ0FBQ08sS0FBcEIsZ0ZBQTJCRixPQUEzQixLQUFzQyxFQUF6QyxFQUErQ2xCLGNBQS9DLFFBQXRCOztBQUVBLFNBQU8sQ0FBQyxHQUFHaUIscUJBQUosRUFBMkIsR0FBR0Usa0JBQTlCLEVBQWtERSxRQUFsRCxDQUEyRFAsb0JBQTNELENBQVA7QUFDRCxDQVpNLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5jb25zdCBub3JtYWxpemVBcnJheSA9IGFycmF5ID0+IGFycmF5Lm1hcChwID0+IHBhdGgubm9ybWFsaXplKHApKVxuXG4vKiogQ29uZGl0aW9uIHBhcmFtZXRlciBoaWVyYXJjaHkgZm9yIGV2YWx1YXRpbmcgYSBub2RlIGFuZCBkZWNpZGluZyB3aGljaCBldmFsdWF0aW9uIGNvbmZpZ3VyYXRpb24gdG8gdXNlOlxuICogMS4gaW1tZWRpYXRlIHZhbHVlIGBzd2l0Y2hWYWx1ZWAgcHJvcGVydHkgb2YgdGhlIGV2YWx1YXRpb24gbm9kZSAodGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbikuXG4gKiAyLiBEaXJlY3RseSBwYXNzZWQgcGFyYW1ldGVycyB0aGF0IHdvdWxkIGVuZCB1cCBpbiB0aGUgYGdyYXBoSW5zdGFuY2UuY29udGV4dGBcbiAqICAgIGUuZy4gYHlhcm4gcnVuIHNjcmlwdE1hbmFnZXIgc2hvdWxkQ29tcGlsZVNjcmlwdD10cnVlIEpTUHJvamVjdC9idWlsZFNvdXJjZUNvZGUgXCIubW9kdWxlUHJvamVjdCh7fSwge2NvbXBpbGU6IFsnLi90ZXN0J119KVwiYFxuICogMy4gUHJvamVjdCBjb25maWd1cmF0aW9uIHZhbHVlcyB0aGF0IHdvdWxkIGJlIGNoZWNrZWRcbiAqICAgIGUuZy4gYHByb2plY3QuY29uZmlndXJhdGlvbi5idWlsZC5jb21waWxlID0gWycuL3NvdXJjZScsICcuL3NjcmlwdCcgXWBcbiAqL1xuZXhwb3J0IGNvbnN0IHNob3VsZFRyYW5zcGlsZSA9ICh7IG5vZGUsIHRyYXZlcnNlciwgdHJhdmVyc2VDYWxsQ29udGV4dCB9KSA9PiB7XG4gIGxldCB0YXJnZXROb2RlID0gdHJhdmVyc2VDYWxsQ29udGV4dC50YXJnZXROb2RlID8gdHJhdmVyc2VDYWxsQ29udGV4dC50YXJnZXROb2RlIDogbm9kZSAvLyBvYmplY3QgdG8gY2hlY2sgdGhlIGNvbmRpdGlvbiBvbi5cbiAgLy8gUmVxdWlyZXMgYGNvbnRleHQudGFyZ2V0UHJvamVjdENvbmZpZ2AgcHJvcGVydHkgdG8gYmUgcHJvdmlkZWQuXG4gIGxldCBhcmd1bWVudE9iamVjdCA9IHRyYXZlcnNlci5jb250ZXh0Py5hcmd1bWVudE9iamVjdCAvLyBkaXJlY3RseSBwYXNzZWQgcGFyYW1ldGVycyB0byB0aGUgQ29udGV4dCBpbnN0YW5jZSBvZiB0aGUgY29uZmlndXJlZCBncmFwaC5cbiAgbGV0IHRhcmdldFByb2plY3RDb25maWcgPSB0cmF2ZXJzZXIuY29udGV4dD8udGFyZ2V0UHJvamVjdENvbmZpZyAvLyBwYXJhbWV0ZXJzIGluIHRoZSBjb25maWd1cmF0aW9uIGZpbGUuXG4gIGFzc2VydCh0YXJnZXRQcm9qZWN0Q29uZmlnLCBg4oCiIHRyYXZlcnNlci5jb250ZXh0IFwidGFyZ2V0UHJvamVjdENvbmZpZ1wiIHZhcmlhYmxlIGlzIHJlcXVpcmVkIHRvIHJ1biBwcm9qZWN0IGRlcGVuZGVudCBjb25kaXRpb25zLmApXG4gIGxldCBjdXJyZW50Tm9kZURpcmVjdG9yeSA9IHRhcmdldE5vZGUucHJvcGVydGllcz8ucmVsYXRpdmVQYXRoICYmIHBhdGgubm9ybWFsaXplKHRhcmdldE5vZGUucHJvcGVydGllcy5yZWxhdGl2ZVBhdGgpXG4gIGFzc2VydChjdXJyZW50Tm9kZURpcmVjdG9yeSwgYOKAoiByZWxhdGl2ZVBhdGggbXVzdCBleGlzdCBvbiBzdGFnZSB0YXJnZXROb2RlIHRoYXQgdXNlcyB0aGlzIGNvbmRpdGlvbiBmb3IgZXZhbHVhdGlvbi5gKVxuICBsZXQgcGFyYW1ldGVyQ29tcGlsZUFycmF5ID0gYXJndW1lbnRPYmplY3Q/LmNvbXBpbGUgfHwgW10gfD4gbm9ybWFsaXplQXJyYXlcbiAgbGV0IGNvbmZpZ0NvbXBpbGVBcnJheSA9IHRhcmdldFByb2plY3RDb25maWcuYnVpbGQ/LmNvbXBpbGUgfHwgW10gfD4gbm9ybWFsaXplQXJyYXlcblxuICByZXR1cm4gWy4uLnBhcmFtZXRlckNvbXBpbGVBcnJheSwgLi4uY29uZmlnQ29tcGlsZUFycmF5XS5pbmNsdWRlcyhjdXJyZW50Tm9kZURpcmVjdG9yeSlcbn1cbiJdfQ==