"use strict";var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.build = build;

var _path = _interopRequireDefault(require("path"));
var _assert = _interopRequireDefault(require("assert"));
var _perf_hooks = require("perf_hooks");
var _async_hooks = _interopRequireDefault(require("async_hooks"));
var _graphTraversal = require("@dependency/graphTraversal");



var graphData = _interopRequireWildcard(require("../resource/taskSequence.graph.json"));const { Graph } = _graphTraversal.Graph;const { Database } = _graphTraversal.Database;const { Context } = _graphTraversal.Context;



const observer = new _perf_hooks.PerformanceObserver(list => {
  const entry = list.getEntries()[0];
  console.log(`Done '${entry.name}'`, entry.duration);
});
observer.observe({ entryTypes: ['measure'], buffered: false });

const hookContext = new Map();
const hook = _async_hooks.default.createHook({
  init(asyncId, type, triggerAsyncId) {


    if (hookContext.has(triggerAsyncId)) {
      hookContext.set(asyncId, hookContext.get(triggerAsyncId));
    }
  },
  destroy(asyncId) {

    if (hookContext.has(asyncId)) {
      hookContext.delete(asyncId);
    }
  } });

hook.enable();


process.on('unhandledRejection', error => {
  throw error;
});

async function build(
{ entryNodeKey, taskContextName, targetProject },
argumentObject)
{
  (0, _assert.default)(entryNodeKey, `• No entryNodeKey for graph traversal was passed.`);
  const targetProjectRoot = targetProject.configuration.rootPath;


  let contextInstance = new Context.clientInterface({
    argumentObject,
    targetProjectConfig: targetProject.configuration.configuration,
    functionReferenceContext: Object.assign(
    require(_path.default.join(__dirname, './function/' + taskContextName)),
    require(_path.default.join(__dirname, './function/condition.js'))) });


  let configuredGraph = Graph.clientInterface({
    parameter: [{ concreteBehaviorList: [contextInstance] }] });

  let graph = new configuredGraph({});
  graph.traversal.processData['executeFunctionReference'] = measurePerformanceProxy(graph.traversal.processData['executeFunctionReference']);


  await clearDatabase(graph.database);
  (0, _assert.default)(Array.isArray(graphData.node) && Array.isArray(graphData.edge), `• Unsupported graph data strcuture- ${graphData.edge} - ${graphData.node}`);
  await graph.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge });
  console.log(`• Graph in-memory database was cleared and 'resource' graph data was loaded.`);

  try {
    let result = await graph.traverse({ nodeKey: entryNodeKey, implementationKey: { processData: 'executeFunctionReference', evaluatePosition: 'evaluateConditionReference' } });
  } catch (error) {
    console.error(error);
    await graph.database.driverInstance.close();
    process.exit();
  }

  await graph.database.driverInstance.close();
}

const measurePerformanceProxy = (callback) =>
new Proxy(callback, {
  async apply(target, thisArg, argumentList) {
    let { stageNode, processNode } = argumentList[0];

    const id = _async_hooks.default.executionAsyncId();
    hookContext.set(id, stageNode);
    _perf_hooks.performance.mark('start' + id);

    let result = await Reflect.apply(...arguments);

    _perf_hooks.performance.mark('end' + id);
    _perf_hooks.performance.measure(stageNode.properties.name || 'Node ID: ' + stageNode.identity, 'start' + id, 'end' + id);

    return result;
  } });


async function clearDatabase(concereteDatabase) {

  const graphDBDriver = concereteDatabase.driverInstance;
  let session = await graphDBDriver.session();
  await session.run(`match (n) detach delete n`);
  session.close();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9zY3JpcHQuanMiXSwibmFtZXMiOlsiR3JhcGgiLCJHcmFwaE1vZHVsZSIsIkRhdGFiYXNlIiwiRGF0YWJhc2VNb2R1bGUiLCJDb250ZXh0IiwiQ29udGV4dE1vZHVsZSIsIm9ic2VydmVyIiwiUGVyZm9ybWFuY2VPYnNlcnZlciIsImxpc3QiLCJlbnRyeSIsImdldEVudHJpZXMiLCJjb25zb2xlIiwibG9nIiwibmFtZSIsImR1cmF0aW9uIiwib2JzZXJ2ZSIsImVudHJ5VHlwZXMiLCJidWZmZXJlZCIsImhvb2tDb250ZXh0IiwiTWFwIiwiaG9vayIsIkFzeW5jSG9va3MiLCJjcmVhdGVIb29rIiwiaW5pdCIsImFzeW5jSWQiLCJ0eXBlIiwidHJpZ2dlckFzeW5jSWQiLCJoYXMiLCJzZXQiLCJnZXQiLCJkZXN0cm95IiwiZGVsZXRlIiwiZW5hYmxlIiwicHJvY2VzcyIsIm9uIiwiZXJyb3IiLCJidWlsZCIsImVudHJ5Tm9kZUtleSIsInRhc2tDb250ZXh0TmFtZSIsInRhcmdldFByb2plY3QiLCJhcmd1bWVudE9iamVjdCIsInRhcmdldFByb2plY3RSb290IiwiY29uZmlndXJhdGlvbiIsInJvb3RQYXRoIiwiY29udGV4dEluc3RhbmNlIiwiY2xpZW50SW50ZXJmYWNlIiwidGFyZ2V0UHJvamVjdENvbmZpZyIsImZ1bmN0aW9uUmVmZXJlbmNlQ29udGV4dCIsIk9iamVjdCIsImFzc2lnbiIsInJlcXVpcmUiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImNvbmZpZ3VyZWRHcmFwaCIsInBhcmFtZXRlciIsImNvbmNyZXRlQmVoYXZpb3JMaXN0IiwiZ3JhcGgiLCJ0cmF2ZXJzYWwiLCJwcm9jZXNzRGF0YSIsIm1lYXN1cmVQZXJmb3JtYW5jZVByb3h5IiwiY2xlYXJEYXRhYmFzZSIsImRhdGFiYXNlIiwiQXJyYXkiLCJpc0FycmF5IiwiZ3JhcGhEYXRhIiwibm9kZSIsImVkZ2UiLCJsb2FkR3JhcGhEYXRhIiwibm9kZUVudHJ5RGF0YSIsImNvbm5lY3Rpb25FbnRyeURhdGEiLCJyZXN1bHQiLCJ0cmF2ZXJzZSIsIm5vZGVLZXkiLCJpbXBsZW1lbnRhdGlvbktleSIsImV2YWx1YXRlUG9zaXRpb24iLCJkcml2ZXJJbnN0YW5jZSIsImNsb3NlIiwiZXhpdCIsImNhbGxiYWNrIiwiUHJveHkiLCJhcHBseSIsInRhcmdldCIsInRoaXNBcmciLCJhcmd1bWVudExpc3QiLCJzdGFnZU5vZGUiLCJwcm9jZXNzTm9kZSIsImlkIiwiZXhlY3V0aW9uQXN5bmNJZCIsInBlcmZvcm1hbmNlIiwibWFyayIsIlJlZmxlY3QiLCJhcmd1bWVudHMiLCJtZWFzdXJlIiwicHJvcGVydGllcyIsImlkZW50aXR5IiwiY29uY2VyZXRlRGF0YWJhc2UiLCJncmFwaERCRHJpdmVyIiwic2Vzc2lvbiIsInJ1biJdLCJtYXBwaW5ncyI6Ijs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUEsd0ZBSEEsTUFBTSxFQUFFQSxLQUFGLEtBQVlDLHFCQUFsQixDQUNBLE1BQU0sRUFBRUMsUUFBRixLQUFlQyx3QkFBckIsQ0FDQSxNQUFNLEVBQUVDLE9BQUYsS0FBY0MsdUJBQXBCOzs7O0FBS0EsTUFBTUMsUUFBUSxHQUFHLElBQUlDLCtCQUFKLENBQXdCQyxJQUFJLElBQUk7QUFDL0MsUUFBTUMsS0FBSyxHQUFHRCxJQUFJLENBQUNFLFVBQUwsR0FBa0IsQ0FBbEIsQ0FBZDtBQUNBQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBYSxTQUFRSCxLQUFLLENBQUNJLElBQUssR0FBaEMsRUFBb0NKLEtBQUssQ0FBQ0ssUUFBMUM7QUFDRCxDQUhnQixDQUFqQjtBQUlBUixRQUFRLENBQUNTLE9BQVQsQ0FBaUIsRUFBRUMsVUFBVSxFQUFFLENBQUMsU0FBRCxDQUFkLEVBQTJCQyxRQUFRLEVBQUUsS0FBckMsRUFBakI7O0FBRUEsTUFBTUMsV0FBVyxHQUFHLElBQUlDLEdBQUosRUFBcEI7QUFDQSxNQUFNQyxJQUFJLEdBQUdDLHFCQUFXQyxVQUFYLENBQXNCO0FBQ2pD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QUFpQixDQUFDcEIsY0FBeEM7QUFDQSxNQUFJc0IsT0FBTyxHQUFHLE1BQU1ELGFBQWEsQ0FBQ0MsT0FBZCxFQUFwQjtBQUNBLFFBQU1BLE9BQU8sQ0FBQ0MsR0FBUixDQUFhLDJCQUFiLENBQU47QUFDQUQsRUFBQUEsT0FBTyxDQUFDckIsS0FBUjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8g8J+YhCBUaGlzIGZpbGUgaXMgdXNlZCB0byBkZWZpbmUgR3VscCB0YXNrcyB3aXRoIHNvdXJjZSBwYXRoIGFuZCBkZXN0aW5hdGlvbiBwYXRoLiBXaGlsZSBndWxwX2luY2x1ZGVOb2RlTW9kdWxlcy5qcyBpcyB1c2VkIHRvIHNhdmUgdGhlIGZ1bmN0aW9ucyBmb3IgdGhlIGJ1aWxkLlxyXG5cclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnXHJcbmltcG9ydCB7IFBlcmZvcm1hbmNlT2JzZXJ2ZXIsIHBlcmZvcm1hbmNlIH0gZnJvbSAncGVyZl9ob29rcydcclxuaW1wb3J0IEFzeW5jSG9va3MgZnJvbSAnYXN5bmNfaG9va3MnXHJcbmltcG9ydCB7IEdyYXBoIGFzIEdyYXBoTW9kdWxlLCBDb250ZXh0IGFzIENvbnRleHRNb2R1bGUsIERhdGFiYXNlIGFzIERhdGFiYXNlTW9kdWxlIH0gZnJvbSAnQGRlcGVuZGVuY3kvZ3JhcGhUcmF2ZXJzYWwnXHJcbmNvbnN0IHsgR3JhcGggfSA9IEdyYXBoTW9kdWxlXHJcbmNvbnN0IHsgRGF0YWJhc2UgfSA9IERhdGFiYXNlTW9kdWxlXHJcbmNvbnN0IHsgQ29udGV4dCB9ID0gQ29udGV4dE1vZHVsZVxyXG5pbXBvcnQgKiBhcyBncmFwaERhdGEgZnJvbSAnLi4vcmVzb3VyY2UvdGFza1NlcXVlbmNlLmdyYXBoLmpzb24nXHJcbi8vIE5PVEU6IHRhc2tzIGFyZSBpbXBvcnRlZCBvbiBydW50aW1lLlxyXG5cclxuLyoqIFBlcmZvcm1hbmNlIG1lYXN1cm1lbnQgKi9cclxuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgUGVyZm9ybWFuY2VPYnNlcnZlcihsaXN0ID0+IHtcclxuICBjb25zdCBlbnRyeSA9IGxpc3QuZ2V0RW50cmllcygpWzBdXHJcbiAgY29uc29sZS5sb2coYERvbmUgJyR7ZW50cnkubmFtZX0nYCwgZW50cnkuZHVyYXRpb24pXHJcbn0pXHJcbm9ic2VydmVyLm9ic2VydmUoeyBlbnRyeVR5cGVzOiBbJ21lYXN1cmUnXSwgYnVmZmVyZWQ6IGZhbHNlIH0pXHJcbi8vQ3JlYXRpbmcgdGhlIGFzeW5jIGhvb2sgaGVyZSB0byBwaWdneWJhY2sgb24gYXN5bmMgY2FsbHNcclxuY29uc3QgaG9va0NvbnRleHQgPSBuZXcgTWFwKClcclxuY29uc3QgaG9vayA9IEFzeW5jSG9va3MuY3JlYXRlSG9vayh7XHJcbiAgaW5pdChhc3luY0lkLCB0eXBlLCB0cmlnZ2VyQXN5bmNJZCkge1xyXG4gICAgLy8gZWFjaCB0aW1lIGEgcmVzb3VyY2UgaXMgaW5pdCwgaWYgdGhlIHBhcmVudCByZXNvdXJjZSB3YXMgYXNzb2NpYXRlZCB3aXRoIGEgY29udGV4dCxcclxuICAgIC8vIHdlIGFzc29jaWF0ZSB0aGUgY2hpbGQgcmVzb3VyY2UgdG8gdGhlIHNhbWUgY29udGV4dFxyXG4gICAgaWYgKGhvb2tDb250ZXh0Lmhhcyh0cmlnZ2VyQXN5bmNJZCkpIHtcclxuICAgICAgaG9va0NvbnRleHQuc2V0KGFzeW5jSWQsIGhvb2tDb250ZXh0LmdldCh0cmlnZ2VyQXN5bmNJZCkpXHJcbiAgICB9XHJcbiAgfSxcclxuICBkZXN0cm95KGFzeW5jSWQpIHtcclxuICAgIC8vIHRoaXMgcHJldmVudHMgbWVtb3J5IGxlYWtzXHJcbiAgICBpZiAoaG9va0NvbnRleHQuaGFzKGFzeW5jSWQpKSB7XHJcbiAgICAgIGhvb2tDb250ZXh0LmRlbGV0ZShhc3luY0lkKVxyXG4gICAgfVxyXG4gIH0sXHJcbn0pXHJcbmhvb2suZW5hYmxlKClcclxuXHJcbi8vIG1ha2UgdW4taGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbnMgdGhyb3cgYW5kIGVuZCBOb2RlanMgcHJvY2Vzcy5cclxucHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgZXJyb3IgPT4ge1xyXG4gIHRocm93IGVycm9yXHJcbn0pXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGQoXHJcbiAgeyBlbnRyeU5vZGVLZXksIHRhc2tDb250ZXh0TmFtZSAvKlRoZSBvYmplY3Qgb2YgdGFza3MgdG8gdXNlIGFzIHJlZmVyZW5jZSBmcm9tIGRhdGFiYXNlIGdyYXBoKi8sIHRhcmdldFByb2plY3QgLypwYXNzZWQgdGhyb3VnaCBzY3JpcHRNYW5hZ2VyKi8gfSxcclxuICBhcmd1bWVudE9iamVjdCwgLy8gc2Vjb25kIGFyZ3VtZW50IGhvbGRzIHBhcmFtZXRlcnMgdGhhdCBtYXliZSB1c2VkIGluIHRoZSBub2RlIGV4ZWN1dGlvbiBmdW5jdGlvbnMuXHJcbikge1xyXG4gIGFzc2VydChlbnRyeU5vZGVLZXksIGDigKIgTm8gZW50cnlOb2RlS2V5IGZvciBncmFwaCB0cmF2ZXJzYWwgd2FzIHBhc3NlZC5gKVxyXG4gIGNvbnN0IHRhcmdldFByb2plY3RSb290ID0gdGFyZ2V0UHJvamVjdC5jb25maWd1cmF0aW9uLnJvb3RQYXRoXHJcblxyXG4gIC8vIHBhc3MgdmFyaWFibGVzIHRocm91Z2ggdGhlIGNvbnRleHQgb2JqZWN0LlxyXG4gIGxldCBjb250ZXh0SW5zdGFuY2UgPSBuZXcgQ29udGV4dC5jbGllbnRJbnRlcmZhY2Uoe1xyXG4gICAgYXJndW1lbnRPYmplY3QsXHJcbiAgICB0YXJnZXRQcm9qZWN0Q29uZmlnOiB0YXJnZXRQcm9qZWN0LmNvbmZpZ3VyYXRpb24uY29uZmlndXJhdGlvbixcclxuICAgIGZ1bmN0aW9uUmVmZXJlbmNlQ29udGV4dDogT2JqZWN0LmFzc2lnbihcclxuICAgICAgICByZXF1aXJlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2Z1bmN0aW9uLycgKyB0YXNrQ29udGV4dE5hbWUpKSxcclxuICAgICAgICByZXF1aXJlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2Z1bmN0aW9uL2NvbmRpdGlvbi5qcycpKVxyXG4gICAgICApLCAvLyB0YXNrcyBjb250ZXh0IG9iamVjdFxyXG4gIH0pXHJcbiAgbGV0IGNvbmZpZ3VyZWRHcmFwaCA9IEdyYXBoLmNsaWVudEludGVyZmFjZSh7XHJcbiAgICBwYXJhbWV0ZXI6IFt7IGNvbmNyZXRlQmVoYXZpb3JMaXN0OiBbY29udGV4dEluc3RhbmNlXSB9XSxcclxuICB9KVxyXG4gIGxldCBncmFwaCA9IG5ldyBjb25maWd1cmVkR3JhcGgoe30pXHJcbiAgZ3JhcGgudHJhdmVyc2FsLnByb2Nlc3NEYXRhWydleGVjdXRlRnVuY3Rpb25SZWZlcmVuY2UnXSA9IG1lYXN1cmVQZXJmb3JtYW5jZVByb3h5KGdyYXBoLnRyYXZlcnNhbC5wcm9jZXNzRGF0YVsnZXhlY3V0ZUZ1bmN0aW9uUmVmZXJlbmNlJ10pIC8vIG1hbmlwdWxhdGUgcHJvY2Vzc2luZyBpbXBsZW1lbnRhdGlvbiBjYWxsYmFja1xyXG5cclxuICAvLyBjbGVhciBkYXRhYmFzZSBhbmQgbG9hZCBncmFwaCBkYXRhOlxyXG4gIGF3YWl0IGNsZWFyRGF0YWJhc2UoZ3JhcGguZGF0YWJhc2UpXHJcbiAgYXNzZXJ0KEFycmF5LmlzQXJyYXkoZ3JhcGhEYXRhLm5vZGUpICYmIEFycmF5LmlzQXJyYXkoZ3JhcGhEYXRhLmVkZ2UpLCBg4oCiIFVuc3VwcG9ydGVkIGdyYXBoIGRhdGEgc3RyY3V0dXJlLSAke2dyYXBoRGF0YS5lZGdlfSAtICR7Z3JhcGhEYXRhLm5vZGV9YClcclxuICBhd2FpdCBncmFwaC5kYXRhYmFzZS5sb2FkR3JhcGhEYXRhKHsgbm9kZUVudHJ5RGF0YTogZ3JhcGhEYXRhLm5vZGUsIGNvbm5lY3Rpb25FbnRyeURhdGE6IGdyYXBoRGF0YS5lZGdlIH0pXHJcbiAgY29uc29sZS5sb2coYOKAoiBHcmFwaCBpbi1tZW1vcnkgZGF0YWJhc2Ugd2FzIGNsZWFyZWQgYW5kICdyZXNvdXJjZScgZ3JhcGggZGF0YSB3YXMgbG9hZGVkLmApXHJcblxyXG4gIHRyeSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZ3JhcGgudHJhdmVyc2UoeyBub2RlS2V5OiBlbnRyeU5vZGVLZXksIGltcGxlbWVudGF0aW9uS2V5OiB7IHByb2Nlc3NEYXRhOiAnZXhlY3V0ZUZ1bmN0aW9uUmVmZXJlbmNlJywgZXZhbHVhdGVQb3NpdGlvbjogJ2V2YWx1YXRlQ29uZGl0aW9uUmVmZXJlbmNlJyB9IH0pXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICBhd2FpdCBncmFwaC5kYXRhYmFzZS5kcml2ZXJJbnN0YW5jZS5jbG9zZSgpXHJcbiAgICBwcm9jZXNzLmV4aXQoKVxyXG4gIH1cclxuICAvLyBsZXQgcmVzdWx0ID0gZ3JhcGgudHJhdmVyc2UoeyBub2RlS2V5OiAnOTE2MDMzOGYtNjk5MC00OTU3LTk1MDYtZGVlYmFmZGI2ZTI5JyB9KVxyXG4gIGF3YWl0IGdyYXBoLmRhdGFiYXNlLmRyaXZlckluc3RhbmNlLmNsb3NlKClcclxufVxyXG5cclxuY29uc3QgbWVhc3VyZVBlcmZvcm1hbmNlUHJveHkgPSBjYWxsYmFjayA9PlxyXG4gIG5ldyBQcm94eShjYWxsYmFjaywge1xyXG4gICAgYXN5bmMgYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmd1bWVudExpc3QpIHtcclxuICAgICAgbGV0IHsgc3RhZ2VOb2RlLCBwcm9jZXNzTm9kZSB9ID0gYXJndW1lbnRMaXN0WzBdXHJcblxyXG4gICAgICBjb25zdCBpZCA9IEFzeW5jSG9va3MuZXhlY3V0aW9uQXN5bmNJZCgpIC8vIHRoaXMgcmV0dXJucyB0aGUgY3VycmVudCBhc3luY2hyb25vdXMgY29udGV4dCdzIGlkXHJcbiAgICAgIGhvb2tDb250ZXh0LnNldChpZCwgc3RhZ2VOb2RlKVxyXG4gICAgICBwZXJmb3JtYW5jZS5tYXJrKCdzdGFydCcgKyBpZClcclxuXHJcbiAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBSZWZsZWN0LmFwcGx5KC4uLmFyZ3VtZW50cylcclxuXHJcbiAgICAgIHBlcmZvcm1hbmNlLm1hcmsoJ2VuZCcgKyBpZClcclxuICAgICAgcGVyZm9ybWFuY2UubWVhc3VyZShzdGFnZU5vZGUucHJvcGVydGllcy5uYW1lIHx8ICdOb2RlIElEOiAnICsgc3RhZ2VOb2RlLmlkZW50aXR5LCAnc3RhcnQnICsgaWQsICdlbmQnICsgaWQpXHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9LFxyXG4gIH0pXHJcblxyXG5hc3luYyBmdW5jdGlvbiBjbGVhckRhdGFiYXNlKGNvbmNlcmV0ZURhdGFiYXNlKSB7XHJcbiAgLy8gRGVsZXRlIGFsbCBub2RlcyBpbiB0aGUgaW4tbWVtb3J5IGRhdGFiYXNlXHJcbiAgY29uc3QgZ3JhcGhEQkRyaXZlciA9IGNvbmNlcmV0ZURhdGFiYXNlLmRyaXZlckluc3RhbmNlXHJcbiAgbGV0IHNlc3Npb24gPSBhd2FpdCBncmFwaERCRHJpdmVyLnNlc3Npb24oKVxyXG4gIGF3YWl0IHNlc3Npb24ucnVuKGBtYXRjaCAobikgZGV0YWNoIGRlbGV0ZSBuYClcclxuICBzZXNzaW9uLmNsb3NlKClcclxufVxyXG4iXX0=