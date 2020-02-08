"use strict";var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.build = build;

var _path = _interopRequireDefault(require("path"));
var _assert = _interopRequireDefault(require("assert"));
var _perf_hooks = require("perf_hooks");
var _async_hooks = _interopRequireDefault(require("async_hooks"));
var _graphTraversal = require("@dependency/graphTraversal");
var _deploymentScript = require("@deployment/deploymentScript");
var graphData = _interopRequireWildcard(require("../resource/taskSequence.graph.json"));



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
{ entryNodeKey, taskContextName, targetProject, memgraph } = {},
argumentObject)
{
  (0, _assert.default)(entryNodeKey, `• No entryNodeKey for graph traversal was passed.`);
  const targetProjectRoot = targetProject.configuration.rootPath;


  let contextInstance = new _graphTraversal.Context.clientInterface({
    data: {
      argumentObject,
      targetProjectConfig: targetProject.configuration.configuration,
      functionReferenceContext: Object.assign(require(_path.default.join(__dirname, './function/' + taskContextName)), require(_path.default.join(__dirname, './function/condition.js'))) } });


  let configuredTraverser = _graphTraversal.Traverser.clientInterface({
    parameter: [{ concreteBehaviorList: [contextInstance] }] });

  let configuredGraph = _graphTraversal.Graph.clientInterface({
    parameter: [{ configuredTraverser, concreteBehaviorList: [] }] });


  let graph = new configuredGraph.clientInterface({});
  let traverser = new graph.configuredTraverser.clientInterface();
  traverser.implementation.processNode['executeFunctionReference'] = measurePerformanceProxy(traverser.implementation.processNode['executeFunctionReference']);


  await _deploymentScript.container.memgraph.clearGraphData({ memgraph, connectionDriver: graph.database.implementation.driverInstance });
  (0, _assert.default)(Array.isArray(graphData.node) && Array.isArray(graphData.edge), `• Unsupported graph data strcuture- ${graphData.edge} - ${graphData.node}`);
  await graph.load({ graphData });
  console.log(`• Graph in-memory database was cleared and 'resource' graph data was loaded.`);

  try {
    let result = await graph.traverse({ traverser, nodeKey: entryNodeKey, implementationKey: { processNode: 'executeFunctionReference', evaluatePosition: 'evaluateConditionReference' } });
  } catch (error) {
    console.error(error);
    await graph.database.implementation.driverInstance.close();
    process.exit();
  }

  await graph.database.implementation.driverInstance.close();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9zY3JpcHQuanMiXSwibmFtZXMiOlsib2JzZXJ2ZXIiLCJQZXJmb3JtYW5jZU9ic2VydmVyIiwibGlzdCIsImVudHJ5IiwiZ2V0RW50cmllcyIsImNvbnNvbGUiLCJsb2ciLCJuYW1lIiwiZHVyYXRpb24iLCJvYnNlcnZlIiwiZW50cnlUeXBlcyIsImJ1ZmZlcmVkIiwiaG9va0NvbnRleHQiLCJNYXAiLCJob29rIiwiQXN5bmNIb29rcyIsImNyZWF0ZUhvb2siLCJpbml0IiwiYXN5bmNJZCIsInR5cGUiLCJ0cmlnZ2VyQXN5bmNJZCIsImhhcyIsInNldCIsImdldCIsImRlc3Ryb3kiLCJkZWxldGUiLCJlbmFibGUiLCJwcm9jZXNzIiwib24iLCJlcnJvciIsImJ1aWxkIiwiZW50cnlOb2RlS2V5IiwidGFza0NvbnRleHROYW1lIiwidGFyZ2V0UHJvamVjdCIsIm1lbWdyYXBoIiwiYXJndW1lbnRPYmplY3QiLCJ0YXJnZXRQcm9qZWN0Um9vdCIsImNvbmZpZ3VyYXRpb24iLCJyb290UGF0aCIsImNvbnRleHRJbnN0YW5jZSIsIkNvbnRleHQiLCJjbGllbnRJbnRlcmZhY2UiLCJkYXRhIiwidGFyZ2V0UHJvamVjdENvbmZpZyIsImZ1bmN0aW9uUmVmZXJlbmNlQ29udGV4dCIsIk9iamVjdCIsImFzc2lnbiIsInJlcXVpcmUiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImNvbmZpZ3VyZWRUcmF2ZXJzZXIiLCJUcmF2ZXJzZXIiLCJwYXJhbWV0ZXIiLCJjb25jcmV0ZUJlaGF2aW9yTGlzdCIsImNvbmZpZ3VyZWRHcmFwaCIsIkdyYXBoIiwiZ3JhcGgiLCJ0cmF2ZXJzZXIiLCJpbXBsZW1lbnRhdGlvbiIsInByb2Nlc3NOb2RlIiwibWVhc3VyZVBlcmZvcm1hbmNlUHJveHkiLCJjb250YWluZXIiLCJjbGVhckdyYXBoRGF0YSIsImNvbm5lY3Rpb25Ecml2ZXIiLCJkYXRhYmFzZSIsImRyaXZlckluc3RhbmNlIiwiQXJyYXkiLCJpc0FycmF5IiwiZ3JhcGhEYXRhIiwibm9kZSIsImVkZ2UiLCJsb2FkIiwicmVzdWx0IiwidHJhdmVyc2UiLCJub2RlS2V5IiwiaW1wbGVtZW50YXRpb25LZXkiLCJldmFsdWF0ZVBvc2l0aW9uIiwiY2xvc2UiLCJleGl0IiwiY2FsbGJhY2siLCJQcm94eSIsImFwcGx5IiwidGFyZ2V0IiwidGhpc0FyZyIsImFyZ3VtZW50TGlzdCIsInN0YWdlTm9kZSIsImlkIiwiZXhlY3V0aW9uQXN5bmNJZCIsInBlcmZvcm1hbmNlIiwibWFyayIsIlJlZmxlY3QiLCJhcmd1bWVudHMiLCJtZWFzdXJlIiwicHJvcGVydGllcyIsImlkZW50aXR5Il0sIm1hcHBpbmdzIjoiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUEsTUFBTUEsUUFBUSxHQUFHLElBQUlDLCtCQUFKLENBQXdCQyxJQUFJLElBQUk7QUFDL0MsUUFBTUMsS0FBSyxHQUFHRCxJQUFJLENBQUNFLFVBQUwsR0FBa0IsQ0FBbEIsQ0FBZDtBQUNBQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBYSxTQUFRSCxLQUFLLENBQUNJLElBQUssR0FBaEMsRUFBb0NKLEtBQUssQ0FBQ0ssUUFBMUM7QUFDRCxDQUhnQixDQUFqQjtBQUlBUixRQUFRLENBQUNTLE9BQVQsQ0FBaUIsRUFBRUMsVUFBVSxFQUFFLENBQUMsU0FBRCxDQUFkLEVBQTJCQyxRQUFRLEVBQUUsS0FBckMsRUFBakI7O0FBRUEsTUFBTUMsV0FBVyxHQUFHLElBQUlDLEdBQUosRUFBcEI7QUFDQSxNQUFNQyxJQUFJLEdBQUdDLHFCQUFXQyxVQUFYLENBQXNCO0FBQ2pDQyxFQUFBQSxJQUFJLENBQUNDLE9BQUQsRUFBVUMsSUFBVixFQUFnQkMsY0FBaEIsRUFBZ0M7OztBQUdsQyxRQUFJUixXQUFXLENBQUNTLEdBQVosQ0FBZ0JELGNBQWhCLENBQUosRUFBcUM7QUFDbkNSLE1BQUFBLFdBQVcsQ0FBQ1UsR0FBWixDQUFnQkosT0FBaEIsRUFBeUJOLFdBQVcsQ0FBQ1csR0FB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QUFRQSxFQUF6Rzs7QUFFQSxXQUFPZCxNQUFQO0FBQ0QsR0FkaUIsRUFBcEIsQ0FERiIsInNvdXJjZXNDb250ZW50IjpbIi8vIPCfmIQgVGhpcyBmaWxlIGlzIHVzZWQgdG8gZGVmaW5lIEd1bHAgdGFza3Mgd2l0aCBzb3VyY2UgcGF0aCBhbmQgZGVzdGluYXRpb24gcGF0aC4gV2hpbGUgZ3VscF9pbmNsdWRlTm9kZU1vZHVsZXMuanMgaXMgdXNlZCB0byBzYXZlIHRoZSBmdW5jdGlvbnMgZm9yIHRoZSBidWlsZC5cclxuXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0J1xyXG5pbXBvcnQgeyBQZXJmb3JtYW5jZU9ic2VydmVyLCBwZXJmb3JtYW5jZSB9IGZyb20gJ3BlcmZfaG9va3MnXHJcbmltcG9ydCBBc3luY0hvb2tzIGZyb20gJ2FzeW5jX2hvb2tzJ1xyXG5pbXBvcnQgeyBHcmFwaCwgQ29udGV4dCwgRGF0YWJhc2UsIFRyYXZlcnNlciB9IGZyb20gJ0BkZXBlbmRlbmN5L2dyYXBoVHJhdmVyc2FsJ1xyXG5pbXBvcnQgeyBjb250YWluZXIgfSBmcm9tICdAZGVwbG95bWVudC9kZXBsb3ltZW50U2NyaXB0J1xyXG5pbXBvcnQgKiBhcyBncmFwaERhdGEgZnJvbSAnLi4vcmVzb3VyY2UvdGFza1NlcXVlbmNlLmdyYXBoLmpzb24nXHJcbi8vIE5PVEU6IHRhc2tzIGFyZSBpbXBvcnRlZCBvbiBydW50aW1lLlxyXG5cclxuLyoqIFBlcmZvcm1hbmNlIG1lYXN1cm1lbnQgKi9cclxuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgUGVyZm9ybWFuY2VPYnNlcnZlcihsaXN0ID0+IHtcclxuICBjb25zdCBlbnRyeSA9IGxpc3QuZ2V0RW50cmllcygpWzBdXHJcbiAgY29uc29sZS5sb2coYERvbmUgJyR7ZW50cnkubmFtZX0nYCwgZW50cnkuZHVyYXRpb24pXHJcbn0pXHJcbm9ic2VydmVyLm9ic2VydmUoeyBlbnRyeVR5cGVzOiBbJ21lYXN1cmUnXSwgYnVmZmVyZWQ6IGZhbHNlIH0pXHJcbi8vQ3JlYXRpbmcgdGhlIGFzeW5jIGhvb2sgaGVyZSB0byBwaWdneWJhY2sgb24gYXN5bmMgY2FsbHNcclxuY29uc3QgaG9va0NvbnRleHQgPSBuZXcgTWFwKClcclxuY29uc3QgaG9vayA9IEFzeW5jSG9va3MuY3JlYXRlSG9vayh7XHJcbiAgaW5pdChhc3luY0lkLCB0eXBlLCB0cmlnZ2VyQXN5bmNJZCkge1xyXG4gICAgLy8gZWFjaCB0aW1lIGEgcmVzb3VyY2UgaXMgaW5pdCwgaWYgdGhlIHBhcmVudCByZXNvdXJjZSB3YXMgYXNzb2NpYXRlZCB3aXRoIGEgY29udGV4dCxcclxuICAgIC8vIHdlIGFzc29jaWF0ZSB0aGUgY2hpbGQgcmVzb3VyY2UgdG8gdGhlIHNhbWUgY29udGV4dFxyXG4gICAgaWYgKGhvb2tDb250ZXh0Lmhhcyh0cmlnZ2VyQXN5bmNJZCkpIHtcclxuICAgICAgaG9va0NvbnRleHQuc2V0KGFzeW5jSWQsIGhvb2tDb250ZXh0LmdldCh0cmlnZ2VyQXN5bmNJZCkpXHJcbiAgICB9XHJcbiAgfSxcclxuICBkZXN0cm95KGFzeW5jSWQpIHtcclxuICAgIC8vIHRoaXMgcHJldmVudHMgbWVtb3J5IGxlYWtzXHJcbiAgICBpZiAoaG9va0NvbnRleHQuaGFzKGFzeW5jSWQpKSB7XHJcbiAgICAgIGhvb2tDb250ZXh0LmRlbGV0ZShhc3luY0lkKVxyXG4gICAgfVxyXG4gIH0sXHJcbn0pXHJcbmhvb2suZW5hYmxlKClcclxuXHJcbi8vIG1ha2UgdW4taGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbnMgdGhyb3cgYW5kIGVuZCBOb2RlanMgcHJvY2Vzcy5cclxucHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgZXJyb3IgPT4ge1xyXG4gIHRocm93IGVycm9yXHJcbn0pXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGQoXHJcbiAgeyBlbnRyeU5vZGVLZXksIHRhc2tDb250ZXh0TmFtZSAvKlRoZSBvYmplY3Qgb2YgdGFza3MgdG8gdXNlIGFzIHJlZmVyZW5jZSBmcm9tIGRhdGFiYXNlIGdyYXBoKi8sIHRhcmdldFByb2plY3QgLypwYXNzZWQgdGhyb3VnaCBzY3JpcHRNYW5hZ2VyKi8sIG1lbWdyYXBoIH0gPSB7fSxcclxuICBhcmd1bWVudE9iamVjdCwgLy8gc2Vjb25kIGFyZ3VtZW50IGhvbGRzIHBhcmFtZXRlcnMgdGhhdCBtYXliZSB1c2VkIGluIHRoZSBub2RlIGV4ZWN1dGlvbiBmdW5jdGlvbnMuXHJcbikge1xyXG4gIGFzc2VydChlbnRyeU5vZGVLZXksIGDigKIgTm8gZW50cnlOb2RlS2V5IGZvciBncmFwaCB0cmF2ZXJzYWwgd2FzIHBhc3NlZC5gKVxyXG4gIGNvbnN0IHRhcmdldFByb2plY3RSb290ID0gdGFyZ2V0UHJvamVjdC5jb25maWd1cmF0aW9uLnJvb3RQYXRoXHJcblxyXG4gIC8vIHBhc3MgdmFyaWFibGVzIHRocm91Z2ggdGhlIGNvbnRleHQgb2JqZWN0LlxyXG4gIGxldCBjb250ZXh0SW5zdGFuY2UgPSBuZXcgQ29udGV4dC5jbGllbnRJbnRlcmZhY2Uoe1xyXG4gICAgZGF0YToge1xyXG4gICAgICBhcmd1bWVudE9iamVjdCxcclxuICAgICAgdGFyZ2V0UHJvamVjdENvbmZpZzogdGFyZ2V0UHJvamVjdC5jb25maWd1cmF0aW9uLmNvbmZpZ3VyYXRpb24sXHJcbiAgICAgIGZ1bmN0aW9uUmVmZXJlbmNlQ29udGV4dDogT2JqZWN0LmFzc2lnbihyZXF1aXJlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2Z1bmN0aW9uLycgKyB0YXNrQ29udGV4dE5hbWUpKSwgcmVxdWlyZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9mdW5jdGlvbi9jb25kaXRpb24uanMnKSkpLCAvLyB0YXNrcyBjb250ZXh0IG9iamVjdFxyXG4gICAgfSxcclxuICB9KVxyXG4gIGxldCBjb25maWd1cmVkVHJhdmVyc2VyID0gVHJhdmVyc2VyLmNsaWVudEludGVyZmFjZSh7XHJcbiAgICBwYXJhbWV0ZXI6IFt7IGNvbmNyZXRlQmVoYXZpb3JMaXN0OiBbY29udGV4dEluc3RhbmNlXSB9XSxcclxuICB9KVxyXG4gIGxldCBjb25maWd1cmVkR3JhcGggPSBHcmFwaC5jbGllbnRJbnRlcmZhY2Uoe1xyXG4gICAgcGFyYW1ldGVyOiBbeyBjb25maWd1cmVkVHJhdmVyc2VyLCBjb25jcmV0ZUJlaGF2aW9yTGlzdDogW10gfV0sXHJcbiAgfSlcclxuXHJcbiAgbGV0IGdyYXBoID0gbmV3IGNvbmZpZ3VyZWRHcmFwaC5jbGllbnRJbnRlcmZhY2Uoe30pXHJcbiAgbGV0IHRyYXZlcnNlciA9IG5ldyBncmFwaC5jb25maWd1cmVkVHJhdmVyc2VyLmNsaWVudEludGVyZmFjZSgpXHJcbiAgdHJhdmVyc2VyLmltcGxlbWVudGF0aW9uLnByb2Nlc3NOb2RlWydleGVjdXRlRnVuY3Rpb25SZWZlcmVuY2UnXSA9IG1lYXN1cmVQZXJmb3JtYW5jZVByb3h5KHRyYXZlcnNlci5pbXBsZW1lbnRhdGlvbi5wcm9jZXNzTm9kZVsnZXhlY3V0ZUZ1bmN0aW9uUmVmZXJlbmNlJ10pIC8vIG1hbmlwdWxhdGUgcHJvY2Vzc2luZyBpbXBsZW1lbnRhdGlvbiBjYWxsYmFja1xyXG5cclxuICAvLyBjbGVhciBkYXRhYmFzZSBhbmQgbG9hZCBncmFwaCBkYXRhOlxyXG4gIGF3YWl0IGNvbnRhaW5lci5tZW1ncmFwaC5jbGVhckdyYXBoRGF0YSh7IG1lbWdyYXBoLCBjb25uZWN0aW9uRHJpdmVyOiBncmFwaC5kYXRhYmFzZS5pbXBsZW1lbnRhdGlvbi5kcml2ZXJJbnN0YW5jZSB9KVxyXG4gIGFzc2VydChBcnJheS5pc0FycmF5KGdyYXBoRGF0YS5ub2RlKSAmJiBBcnJheS5pc0FycmF5KGdyYXBoRGF0YS5lZGdlKSwgYOKAoiBVbnN1cHBvcnRlZCBncmFwaCBkYXRhIHN0cmN1dHVyZS0gJHtncmFwaERhdGEuZWRnZX0gLSAke2dyYXBoRGF0YS5ub2RlfWApXHJcbiAgYXdhaXQgZ3JhcGgubG9hZCh7IGdyYXBoRGF0YSB9KVxyXG4gIGNvbnNvbGUubG9nKGDigKIgR3JhcGggaW4tbWVtb3J5IGRhdGFiYXNlIHdhcyBjbGVhcmVkIGFuZCAncmVzb3VyY2UnIGdyYXBoIGRhdGEgd2FzIGxvYWRlZC5gKVxyXG5cclxuICB0cnkge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGdyYXBoLnRyYXZlcnNlKHsgdHJhdmVyc2VyLCBub2RlS2V5OiBlbnRyeU5vZGVLZXksIGltcGxlbWVudGF0aW9uS2V5OiB7IHByb2Nlc3NOb2RlOiAnZXhlY3V0ZUZ1bmN0aW9uUmVmZXJlbmNlJywgZXZhbHVhdGVQb3NpdGlvbjogJ2V2YWx1YXRlQ29uZGl0aW9uUmVmZXJlbmNlJyB9IH0pXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICBhd2FpdCBncmFwaC5kYXRhYmFzZS5pbXBsZW1lbnRhdGlvbi5kcml2ZXJJbnN0YW5jZS5jbG9zZSgpXHJcbiAgICBwcm9jZXNzLmV4aXQoKVxyXG4gIH1cclxuICAvLyBsZXQgcmVzdWx0ID0gZ3JhcGgudHJhdmVyc2UoeyBub2RlS2V5OiAnOTE2MDMzOGYtNjk5MC00OTU3LTk1MDYtZGVlYmFmZGI2ZTI5JyB9KVxyXG4gIGF3YWl0IGdyYXBoLmRhdGFiYXNlLmltcGxlbWVudGF0aW9uLmRyaXZlckluc3RhbmNlLmNsb3NlKClcclxufVxyXG5cclxuY29uc3QgbWVhc3VyZVBlcmZvcm1hbmNlUHJveHkgPSBjYWxsYmFjayA9PlxyXG4gIG5ldyBQcm94eShjYWxsYmFjaywge1xyXG4gICAgYXN5bmMgYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmd1bWVudExpc3QpIHtcclxuICAgICAgbGV0IHsgc3RhZ2VOb2RlLCBwcm9jZXNzTm9kZSB9ID0gYXJndW1lbnRMaXN0WzBdXHJcblxyXG4gICAgICBjb25zdCBpZCA9IEFzeW5jSG9va3MuZXhlY3V0aW9uQXN5bmNJZCgpIC8vIHRoaXMgcmV0dXJucyB0aGUgY3VycmVudCBhc3luY2hyb25vdXMgY29udGV4dCdzIGlkXHJcbiAgICAgIGhvb2tDb250ZXh0LnNldChpZCwgc3RhZ2VOb2RlKVxyXG4gICAgICBwZXJmb3JtYW5jZS5tYXJrKCdzdGFydCcgKyBpZClcclxuXHJcbiAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBSZWZsZWN0LmFwcGx5KC4uLmFyZ3VtZW50cylcclxuXHJcbiAgICAgIHBlcmZvcm1hbmNlLm1hcmsoJ2VuZCcgKyBpZClcclxuICAgICAgcGVyZm9ybWFuY2UubWVhc3VyZShzdGFnZU5vZGUucHJvcGVydGllcy5uYW1lIHx8ICdOb2RlIElEOiAnICsgc3RhZ2VOb2RlLmlkZW50aXR5LCAnc3RhcnQnICsgaWQsICdlbmQnICsgaWQpXHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9LFxyXG4gIH0pXHJcbiJdfQ==