"use strict";var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.build = build;


var _assert = _interopRequireDefault(require("assert"));
var _perf_hooks = require("perf_hooks");
var _async_hooks = _interopRequireDefault(require("async_hooks"));
var _graphTraversal = require("@dependency/graphTraversal");



var graphData = _interopRequireWildcard(require("../resource/taskSequence.graphData.json"));const { Graph } = _graphTraversal.Graph;const { Database } = _graphTraversal.Database;const { Context } = _graphTraversal.Context;



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
    functionContext: require('./function/' + taskContextName),
    conditionContext: require('./function/condition.js') });

  let configuredGraph = Graph.clientInterface({
    parameter: [{ concreteBehaviorList: [contextInstance] }] });

  let graph = new configuredGraph({});
  graph.traversal.processData['executeFunctionReference'] = measurePerformanceProxy(graph.traversal.processData['executeFunctionReference']);


  let concereteDatabase = graph.database;
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
    let { node } = argumentList[0];

    const id = _async_hooks.default.executionAsyncId();
    hookContext.set(id, node);
    _perf_hooks.performance.mark('start' + id);

    let result = await Reflect.apply(...arguments);

    _perf_hooks.performance.mark('end' + id);
    _perf_hooks.performance.measure(node.properties.name || 'Node ID: ' + node.identity, 'start' + id, 'end' + id);

    return result;
  } });


async function clearDatabase(concereteDatabase) {

  const graphDBDriver = concereteDatabase.driverInstance;
  let session = await graphDBDriver.session();
  await session.run(`match (n) detach delete n`);
  session.close();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9zY3JpcHQuanMiXSwibmFtZXMiOlsiR3JhcGgiLCJHcmFwaE1vZHVsZSIsIkRhdGFiYXNlIiwiRGF0YWJhc2VNb2R1bGUiLCJDb250ZXh0IiwiQ29udGV4dE1vZHVsZSIsIm9ic2VydmVyIiwiUGVyZm9ybWFuY2VPYnNlcnZlciIsImxpc3QiLCJlbnRyeSIsImdldEVudHJpZXMiLCJjb25zb2xlIiwibG9nIiwibmFtZSIsImR1cmF0aW9uIiwib2JzZXJ2ZSIsImVudHJ5VHlwZXMiLCJidWZmZXJlZCIsImhvb2tDb250ZXh0IiwiTWFwIiwiaG9vayIsIkFzeW5jSG9va3MiLCJjcmVhdGVIb29rIiwiaW5pdCIsImFzeW5jSWQiLCJ0eXBlIiwidHJpZ2dlckFzeW5jSWQiLCJoYXMiLCJzZXQiLCJnZXQiLCJkZXN0cm95IiwiZGVsZXRlIiwiZW5hYmxlIiwicHJvY2VzcyIsIm9uIiwiZXJyb3IiLCJidWlsZCIsImVudHJ5Tm9kZUtleSIsInRhc2tDb250ZXh0TmFtZSIsInRhcmdldFByb2plY3QiLCJhcmd1bWVudE9iamVjdCIsInRhcmdldFByb2plY3RSb290IiwiY29uZmlndXJhdGlvbiIsInJvb3RQYXRoIiwiY29udGV4dEluc3RhbmNlIiwiY2xpZW50SW50ZXJmYWNlIiwidGFyZ2V0UHJvamVjdENvbmZpZyIsImZ1bmN0aW9uQ29udGV4dCIsInJlcXVpcmUiLCJjb25kaXRpb25Db250ZXh0IiwiY29uZmlndXJlZEdyYXBoIiwicGFyYW1ldGVyIiwiY29uY3JldGVCZWhhdmlvckxpc3QiLCJncmFwaCIsInRyYXZlcnNhbCIsInByb2Nlc3NEYXRhIiwibWVhc3VyZVBlcmZvcm1hbmNlUHJveHkiLCJjb25jZXJldGVEYXRhYmFzZSIsImRhdGFiYXNlIiwiY2xlYXJEYXRhYmFzZSIsIkFycmF5IiwiaXNBcnJheSIsImdyYXBoRGF0YSIsIm5vZGUiLCJlZGdlIiwibG9hZEdyYXBoRGF0YSIsIm5vZGVFbnRyeURhdGEiLCJjb25uZWN0aW9uRW50cnlEYXRhIiwicmVzdWx0IiwidHJhdmVyc2UiLCJub2RlS2V5IiwiaW1wbGVtZW50YXRpb25LZXkiLCJldmFsdWF0ZVBvc2l0aW9uIiwiZHJpdmVySW5zdGFuY2UiLCJjbG9zZSIsImV4aXQiLCJjYWxsYmFjayIsIlByb3h5IiwiYXBwbHkiLCJ0YXJnZXQiLCJ0aGlzQXJnIiwiYXJndW1lbnRMaXN0IiwiaWQiLCJleGVjdXRpb25Bc3luY0lkIiwicGVyZm9ybWFuY2UiLCJtYXJrIiwiUmVmbGVjdCIsImFyZ3VtZW50cyIsIm1lYXN1cmUiLCJwcm9wZXJ0aWVzIiwiaWRlbnRpdHkiLCJncmFwaERCRHJpdmVyIiwic2Vzc2lvbiIsInJ1biJdLCJtYXBwaW5ncyI6Ijs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQSw0RkFIQSxNQUFNLEVBQUVBLEtBQUYsS0FBWUMscUJBQWxCLENBQ0EsTUFBTSxFQUFFQyxRQUFGLEtBQWVDLHdCQUFyQixDQUNBLE1BQU0sRUFBRUMsT0FBRixLQUFjQyx1QkFBcEI7Ozs7QUFLQSxNQUFNQyxRQUFRLEdBQUcsSUFBSUMsK0JBQUosQ0FBd0JDLElBQUksSUFBSTtBQUMvQyxRQUFNQyxLQUFLLEdBQUdELElBQUksQ0FBQ0UsVUFBTCxHQUFrQixDQUFsQixDQUFkO0FBQ0FDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFhLFNBQVFILEtBQUssQ0FBQ0ksSUFBSyxHQUFoQyxFQUFvQ0osS0FBSyxDQUFDSyxRQUExQztBQUNELENBSGdCLENBQWpCO0FBSUFSLFFBQVEsQ0FBQ1MsT0FBVCxDQUFpQixFQUFFQyxVQUFVLEVBQUUsQ0FBQyxTQUFELENBQWQsRUFBMkJDLFFBQVEsRUFBRSxLQUFyQyxFQUFqQjs7QUFFQSxNQUFNQyxXQUFXLEdBQUcsSUFBSUMsR0FBSixFQUFwQjtBQUNBLE1BQU1DLElBQUksR0FBR0MscUJBQVdDLFVBQVgsQ0FBc0I7QUFDakNDLEVBQUFBLElBQUksQ0FBQ0MsT0FBRCxFQUFVQyxJQUFWLEVBQWdCQyxjQUFoQixFQUFnQzs7O0FBR2xDLFFB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QUFBLE9BQU8sQ0FBQ2xCLEtBQVI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIPCfmIQgVGhpcyBmaWxlIGlzIHVzZWQgdG8gZGVmaW5lIEd1bHAgdGFza3Mgd2l0aCBzb3VyY2UgcGF0aCBhbmQgZGVzdGluYXRpb24gcGF0aC4gV2hpbGUgZ3VscF9pbmNsdWRlTm9kZU1vZHVsZXMuanMgaXMgdXNlZCB0byBzYXZlIHRoZSBmdW5jdGlvbnMgZm9yIHRoZSBidWlsZC5cclxuXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0J1xyXG5pbXBvcnQgeyBQZXJmb3JtYW5jZU9ic2VydmVyLCBwZXJmb3JtYW5jZSB9IGZyb20gJ3BlcmZfaG9va3MnXHJcbmltcG9ydCBBc3luY0hvb2tzIGZyb20gJ2FzeW5jX2hvb2tzJ1xyXG5pbXBvcnQgeyBHcmFwaCBhcyBHcmFwaE1vZHVsZSwgQ29udGV4dCBhcyBDb250ZXh0TW9kdWxlLCBEYXRhYmFzZSBhcyBEYXRhYmFzZU1vZHVsZSB9IGZyb20gJ0BkZXBlbmRlbmN5L2dyYXBoVHJhdmVyc2FsJ1xyXG5jb25zdCB7IEdyYXBoIH0gPSBHcmFwaE1vZHVsZVxyXG5jb25zdCB7IERhdGFiYXNlIH0gPSBEYXRhYmFzZU1vZHVsZVxyXG5jb25zdCB7IENvbnRleHQgfSA9IENvbnRleHRNb2R1bGVcclxuaW1wb3J0ICogYXMgZ3JhcGhEYXRhIGZyb20gJy4uL3Jlc291cmNlL3Rhc2tTZXF1ZW5jZS5ncmFwaERhdGEuanNvbidcclxuLy8gTk9URTogdGFza3MgYXJlIGltcG9ydGVkIG9uIHJ1bnRpbWUuXHJcblxyXG4vKiogUGVyZm9ybWFuY2UgbWVhc3VybWVudCAqL1xyXG5jb25zdCBvYnNlcnZlciA9IG5ldyBQZXJmb3JtYW5jZU9ic2VydmVyKGxpc3QgPT4ge1xyXG4gIGNvbnN0IGVudHJ5ID0gbGlzdC5nZXRFbnRyaWVzKClbMF1cclxuICBjb25zb2xlLmxvZyhgRG9uZSAnJHtlbnRyeS5uYW1lfSdgLCBlbnRyeS5kdXJhdGlvbilcclxufSlcclxub2JzZXJ2ZXIub2JzZXJ2ZSh7IGVudHJ5VHlwZXM6IFsnbWVhc3VyZSddLCBidWZmZXJlZDogZmFsc2UgfSlcclxuLy9DcmVhdGluZyB0aGUgYXN5bmMgaG9vayBoZXJlIHRvIHBpZ2d5YmFjayBvbiBhc3luYyBjYWxsc1xyXG5jb25zdCBob29rQ29udGV4dCA9IG5ldyBNYXAoKVxyXG5jb25zdCBob29rID0gQXN5bmNIb29rcy5jcmVhdGVIb29rKHtcclxuICBpbml0KGFzeW5jSWQsIHR5cGUsIHRyaWdnZXJBc3luY0lkKSB7XHJcbiAgICAvLyBlYWNoIHRpbWUgYSByZXNvdXJjZSBpcyBpbml0LCBpZiB0aGUgcGFyZW50IHJlc291cmNlIHdhcyBhc3NvY2lhdGVkIHdpdGggYSBjb250ZXh0LFxyXG4gICAgLy8gd2UgYXNzb2NpYXRlIHRoZSBjaGlsZCByZXNvdXJjZSB0byB0aGUgc2FtZSBjb250ZXh0XHJcbiAgICBpZiAoaG9va0NvbnRleHQuaGFzKHRyaWdnZXJBc3luY0lkKSkge1xyXG4gICAgICBob29rQ29udGV4dC5zZXQoYXN5bmNJZCwgaG9va0NvbnRleHQuZ2V0KHRyaWdnZXJBc3luY0lkKSlcclxuICAgIH1cclxuICB9LFxyXG4gIGRlc3Ryb3koYXN5bmNJZCkge1xyXG4gICAgLy8gdGhpcyBwcmV2ZW50cyBtZW1vcnkgbGVha3NcclxuICAgIGlmIChob29rQ29udGV4dC5oYXMoYXN5bmNJZCkpIHtcclxuICAgICAgaG9va0NvbnRleHQuZGVsZXRlKGFzeW5jSWQpXHJcbiAgICB9XHJcbiAgfSxcclxufSlcclxuaG9vay5lbmFibGUoKVxyXG5cclxuLy8gbWFrZSB1bi1oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9ucyB0aHJvdyBhbmQgZW5kIE5vZGVqcyBwcm9jZXNzLlxyXG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCBlcnJvciA9PiB7XHJcbiAgdGhyb3cgZXJyb3JcclxufSlcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZChcclxuICB7IGVudHJ5Tm9kZUtleSwgdGFza0NvbnRleHROYW1lIC8qVGhlIG9iamVjdCBvZiB0YXNrcyB0byB1c2UgYXMgcmVmZXJlbmNlIGZyb20gZGF0YWJhc2UgZ3JhcGgqLywgdGFyZ2V0UHJvamVjdCAvKnBhc3NlZCB0aHJvdWdoIHNjcmlwdE1hbmFnZXIqLyB9LFxyXG4gIGFyZ3VtZW50T2JqZWN0LCAvLyBzZWNvbmQgYXJndW1lbnQgaG9sZHMgcGFyYW1ldGVycyB0aGF0IG1heWJlIHVzZWQgaW4gdGhlIG5vZGUgZXhlY3V0aW9uIGZ1bmN0aW9ucy5cclxuKSB7XHJcbiAgYXNzZXJ0KGVudHJ5Tm9kZUtleSwgYOKAoiBObyBlbnRyeU5vZGVLZXkgZm9yIGdyYXBoIHRyYXZlcnNhbCB3YXMgcGFzc2VkLmApXHJcbiAgY29uc3QgdGFyZ2V0UHJvamVjdFJvb3QgPSB0YXJnZXRQcm9qZWN0LmNvbmZpZ3VyYXRpb24ucm9vdFBhdGhcclxuXHJcbiAgLy8gcGFzcyB2YXJpYWJsZXMgdGhyb3VnaCB0aGUgY29udGV4dCBvYmplY3QuXHJcbiAgbGV0IGNvbnRleHRJbnN0YW5jZSA9IG5ldyBDb250ZXh0LmNsaWVudEludGVyZmFjZSh7XHJcbiAgICBhcmd1bWVudE9iamVjdCxcclxuICAgIHRhcmdldFByb2plY3RDb25maWc6IHRhcmdldFByb2plY3QuY29uZmlndXJhdGlvbi5jb25maWd1cmF0aW9uLFxyXG4gICAgZnVuY3Rpb25Db250ZXh0OiByZXF1aXJlKCcuL2Z1bmN0aW9uLycgKyB0YXNrQ29udGV4dE5hbWUpLCAvLyB0YXNrcyBjb250ZXh0IG9iamVjdFxyXG4gICAgY29uZGl0aW9uQ29udGV4dDogcmVxdWlyZSgnLi9mdW5jdGlvbi9jb25kaXRpb24uanMnKSxcclxuICB9KVxyXG4gIGxldCBjb25maWd1cmVkR3JhcGggPSBHcmFwaC5jbGllbnRJbnRlcmZhY2Uoe1xyXG4gICAgcGFyYW1ldGVyOiBbeyBjb25jcmV0ZUJlaGF2aW9yTGlzdDogW2NvbnRleHRJbnN0YW5jZV0gfV0sXHJcbiAgfSlcclxuICBsZXQgZ3JhcGggPSBuZXcgY29uZmlndXJlZEdyYXBoKHt9KVxyXG4gIGdyYXBoLnRyYXZlcnNhbC5wcm9jZXNzRGF0YVsnZXhlY3V0ZUZ1bmN0aW9uUmVmZXJlbmNlJ10gPSBtZWFzdXJlUGVyZm9ybWFuY2VQcm94eShncmFwaC50cmF2ZXJzYWwucHJvY2Vzc0RhdGFbJ2V4ZWN1dGVGdW5jdGlvblJlZmVyZW5jZSddKSAvLyBtYW5pcHVsYXRlIHByb2Nlc3NpbmcgaW1wbGVtZW50YXRpb24gY2FsbGJhY2tcclxuXHJcbiAgLy8gY2xlYXIgZGF0YWJhc2UgYW5kIGxvYWQgZ3JhcGggZGF0YTpcclxuICBsZXQgY29uY2VyZXRlRGF0YWJhc2UgPSBncmFwaC5kYXRhYmFzZVxyXG4gIGF3YWl0IGNsZWFyRGF0YWJhc2UoZ3JhcGguZGF0YWJhc2UpXHJcbiAgYXNzZXJ0KEFycmF5LmlzQXJyYXkoZ3JhcGhEYXRhLm5vZGUpICYmIEFycmF5LmlzQXJyYXkoZ3JhcGhEYXRhLmVkZ2UpLCBg4oCiIFVuc3VwcG9ydGVkIGdyYXBoIGRhdGEgc3RyY3V0dXJlLSAke2dyYXBoRGF0YS5lZGdlfSAtICR7Z3JhcGhEYXRhLm5vZGV9YClcclxuICBhd2FpdCBncmFwaC5kYXRhYmFzZS5sb2FkR3JhcGhEYXRhKHsgbm9kZUVudHJ5RGF0YTogZ3JhcGhEYXRhLm5vZGUsIGNvbm5lY3Rpb25FbnRyeURhdGE6IGdyYXBoRGF0YS5lZGdlIH0pXHJcbiAgY29uc29sZS5sb2coYOKAoiBHcmFwaCBpbi1tZW1vcnkgZGF0YWJhc2Ugd2FzIGNsZWFyZWQgYW5kICdyZXNvdXJjZScgZ3JhcGggZGF0YSB3YXMgbG9hZGVkLmApXHJcblxyXG4gIHRyeSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZ3JhcGgudHJhdmVyc2UoeyBub2RlS2V5OiBlbnRyeU5vZGVLZXksIGltcGxlbWVudGF0aW9uS2V5OiB7IHByb2Nlc3NEYXRhOiAnZXhlY3V0ZUZ1bmN0aW9uUmVmZXJlbmNlJywgZXZhbHVhdGVQb3NpdGlvbjogJ2V2YWx1YXRlQ29uZGl0aW9uUmVmZXJlbmNlJyB9IH0pXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICBhd2FpdCBncmFwaC5kYXRhYmFzZS5kcml2ZXJJbnN0YW5jZS5jbG9zZSgpXHJcbiAgICBwcm9jZXNzLmV4aXQoKVxyXG4gIH1cclxuICAvLyBsZXQgcmVzdWx0ID0gZ3JhcGgudHJhdmVyc2UoeyBub2RlS2V5OiAnOTE2MDMzOGYtNjk5MC00OTU3LTk1MDYtZGVlYmFmZGI2ZTI5JyB9KVxyXG4gIGF3YWl0IGdyYXBoLmRhdGFiYXNlLmRyaXZlckluc3RhbmNlLmNsb3NlKClcclxufVxyXG5cclxuY29uc3QgbWVhc3VyZVBlcmZvcm1hbmNlUHJveHkgPSBjYWxsYmFjayA9PlxyXG4gIG5ldyBQcm94eShjYWxsYmFjaywge1xyXG4gICAgYXN5bmMgYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmd1bWVudExpc3QpIHtcclxuICAgICAgbGV0IHsgbm9kZSB9ID0gYXJndW1lbnRMaXN0WzBdXHJcblxyXG4gICAgICBjb25zdCBpZCA9IEFzeW5jSG9va3MuZXhlY3V0aW9uQXN5bmNJZCgpIC8vIHRoaXMgcmV0dXJucyB0aGUgY3VycmVudCBhc3luY2hyb25vdXMgY29udGV4dCdzIGlkXHJcbiAgICAgIGhvb2tDb250ZXh0LnNldChpZCwgbm9kZSlcclxuICAgICAgcGVyZm9ybWFuY2UubWFyaygnc3RhcnQnICsgaWQpXHJcblxyXG4gICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgUmVmbGVjdC5hcHBseSguLi5hcmd1bWVudHMpXHJcblxyXG4gICAgICBwZXJmb3JtYW5jZS5tYXJrKCdlbmQnICsgaWQpXHJcbiAgICAgIHBlcmZvcm1hbmNlLm1lYXN1cmUobm9kZS5wcm9wZXJ0aWVzLm5hbWUgfHwgJ05vZGUgSUQ6ICcgKyBub2RlLmlkZW50aXR5LCAnc3RhcnQnICsgaWQsICdlbmQnICsgaWQpXHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9LFxyXG4gIH0pXHJcblxyXG5hc3luYyBmdW5jdGlvbiBjbGVhckRhdGFiYXNlKGNvbmNlcmV0ZURhdGFiYXNlKSB7XHJcbiAgLy8gRGVsZXRlIGFsbCBub2RlcyBpbiB0aGUgaW4tbWVtb3J5IGRhdGFiYXNlXHJcbiAgY29uc3QgZ3JhcGhEQkRyaXZlciA9IGNvbmNlcmV0ZURhdGFiYXNlLmRyaXZlckluc3RhbmNlXHJcbiAgbGV0IHNlc3Npb24gPSBhd2FpdCBncmFwaERCRHJpdmVyLnNlc3Npb24oKVxyXG4gIGF3YWl0IHNlc3Npb24ucnVuKGBtYXRjaCAobikgZGV0YWNoIGRlbGV0ZSBuYClcclxuICBzZXNzaW9uLmNsb3NlKClcclxufVxyXG4iXX0=