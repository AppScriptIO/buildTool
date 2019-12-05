"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.moduleProject = moduleProject;var _fs = _interopRequireDefault(require("fs"));
var _fsExtra = require("fs-extra");

var _deploymentScript = require("@dependency/deploymentScript");
var _deploymentProvisioning = require("@dependency/deploymentProvisioning");
var _buildSourceCode = require("./buildSourceCode.js");
const { bumpVersion } = _deploymentScript.packageVersion;
const { createGithubBranchedRelease } = _deploymentScript.release;

async function moduleProject({ api, tagName }) {
  let distributionPath = api.project.configuration.configuration.directory.distribution;
  if (_fs.default.existsSync(distributionPath)) (0, _fsExtra.removeSync)(distributionPath);

  _deploymentProvisioning.memgraphContainer.runDockerContainer();
  let version = await bumpVersion({ api });
  await createGithubBranchedRelease({
    api,
    tagName: tagName || version,
    buildCallback: () => (0, _buildSourceCode.moduleProject)({ api }) });

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NjcmlwdC9idWlsZEFuZFJlbGVhc2UuanMiXSwibmFtZXMiOlsiYnVtcFZlcnNpb24iLCJwYWNrYWdlVmVyc2lvbiIsImNyZWF0ZUdpdGh1YkJyYW5jaGVkUmVsZWFzZSIsInJlbGVhc2UiLCJtb2R1bGVQcm9qZWN0IiwiYXBpIiwidGFnTmFtZSIsImRpc3RyaWJ1dGlvblBhdGgiLCJwcm9qZWN0IiwiY29uZmlndXJhdGlvbiIsImRpcmVjdG9yeSIsImRpc3RyaWJ1dGlvbiIsImZpbGVzeXN0ZW0iLCJleGlzdHNTeW5jIiwibWVtZ3JhcGhDb250YWluZXIiLCJydW5Eb2NrZXJDb250YWluZXIiLCJ2ZXJzaW9uIiwiYnVpbGRDYWxsYmFjayJdLCJtYXBwaW5ncyI6InNNQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTSxFQUFFQSxXQUFGLEtBQWtCQyxnQ0FBeEI7QUFDQSxNQUFNLEVBQUVDLDJCQUFGLEtBQWtDQyx5QkFBeEM7O0FBRU8sZUFBZUMsYUFBZixDQUE2QixFQUFFQyxHQUFGLEVBQU9DLE9BQVAsRUFBN0IsRUFBK0M7QUFDcEQsTUFBSUMsZ0JBQWdCLEdBQUdGLEdBQUcsQ0FBQ0csT0FBSixDQUFZQyxhQUFaLENBQTBCQSxhQUExQixDQUF3Q0MsU0FBeEMsQ0FBa0RDLFlBQXpFO0FBQ0EsTUFBSUMsWUFBV0MsVUFBWCxDQUFzQk4sZ0JBQXRCLENBQUosRUFBNkMseUJBQVdBLGdCQUFYOztBQUU3Q08sNENBQWtCQyxrQkFBbEI7QUFDQSxNQUFJQyxPQUFPLEdBQUcsTUFBTWhCLFdBQVcsQ0FBQyxFQUFFSyxHQUFGLEVBQUQsQ0FBL0I7QUFDQSxRQUFNSCwyQkFBMkIsQ0FBQztBQUNoQ0csSUFBQUEsR0FEZ0M7QUFFaENDLElBQUFBLE9BQU8sRUFBRUEsT0FBTyxJQUFJVSxPQUZZO0FBR2hDQyxJQUFBQSxhQUFhLEVBQUUsTUFBTSxvQ0FBbUIsRUFBRVosR0FBRixFQUFuQixDQUhXLEVBQUQsQ0FBakM7O0FBS0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmlsZXN5c3RlbSBmcm9tICdmcydcbmltcG9ydCB7IHJlbW92ZVN5bmMgfSBmcm9tICdmcy1leHRyYSdcblxuaW1wb3J0IHsgYnVpbGRBbmRSZWxlYXNlLCBwYWNrYWdlVmVyc2lvbiwgcmVsZWFzZSB9IGZyb20gJ0BkZXBlbmRlbmN5L2RlcGxveW1lbnRTY3JpcHQnXG5pbXBvcnQgeyBtZW1ncmFwaENvbnRhaW5lciB9IGZyb20gJ0BkZXBlbmRlbmN5L2RlcGxveW1lbnRQcm92aXNpb25pbmcnXG5pbXBvcnQgeyBtb2R1bGVQcm9qZWN0IGFzIGJ1aWxkTW9kdWxlUHJvamVjdCB9IGZyb20gJy4vYnVpbGRTb3VyY2VDb2RlLmpzJ1xuY29uc3QgeyBidW1wVmVyc2lvbiB9ID0gcGFja2FnZVZlcnNpb25cbmNvbnN0IHsgY3JlYXRlR2l0aHViQnJhbmNoZWRSZWxlYXNlIH0gPSByZWxlYXNlXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtb2R1bGVQcm9qZWN0KHsgYXBpLCB0YWdOYW1lIH0pIHtcbiAgbGV0IGRpc3RyaWJ1dGlvblBhdGggPSBhcGkucHJvamVjdC5jb25maWd1cmF0aW9uLmNvbmZpZ3VyYXRpb24uZGlyZWN0b3J5LmRpc3RyaWJ1dGlvblxuICBpZiAoZmlsZXN5c3RlbS5leGlzdHNTeW5jKGRpc3RyaWJ1dGlvblBhdGgpKSByZW1vdmVTeW5jKGRpc3RyaWJ1dGlvblBhdGgpIC8vIGRlbGV0ZSBleGlzdGluZyBkZXN0cmlidXRpb24gZm9sZGVyIHRvIHByZXZlbnQgbG9hZGluZyB0aGUgZGlzdHJpYnV0aW9uIGNvZGUgaW5zdGVhZCBvZiB0aGUgc291cmNlIChpbiB0aGlzIGNhc2UgaXQgdHJhbnNwaWxlcyBpdHMgb3duIHJlcG9zaXRvcnkpLlxuXG4gIG1lbWdyYXBoQ29udGFpbmVyLnJ1bkRvY2tlckNvbnRhaW5lcigpIC8vIHJ1biBtZW1ncmFwaCBjb250YWluZXIgZm9yIHVzYWdlIGluIGJ1aWxkVG9vbCBncmFwaFRyYXZlcnNhbCBtb2R1bGUuXG4gIGxldCB2ZXJzaW9uID0gYXdhaXQgYnVtcFZlcnNpb24oeyBhcGkgfSlcbiAgYXdhaXQgY3JlYXRlR2l0aHViQnJhbmNoZWRSZWxlYXNlKHtcbiAgICBhcGksXG4gICAgdGFnTmFtZTogdGFnTmFtZSB8fCB2ZXJzaW9uLFxuICAgIGJ1aWxkQ2FsbGJhY2s6ICgpID0+IGJ1aWxkTW9kdWxlUHJvamVjdCh7IGFwaSB9KSxcbiAgfSlcbn1cbiJdfQ==