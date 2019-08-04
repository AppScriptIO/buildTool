// 😄 This file is used to define Gulp tasks with source path and destination path. While gulp_includeNodeModules.js is used to save the functions for the build.

import path from 'path'
import assert from 'assert'
import { PerformanceObserver, performance } from 'perf_hooks'
import AsyncHooks from 'async_hooks'
import ownConfiguration from '../configuration'
import { Graph as GraphModule, Context as ContextModule } from '@dependency/graphTraversal'
const { Graph } = GraphModule
const { Context } = ContextModule
// NOTE: tasks are imported on runtime.

/** Performance measurment */
const observer = new PerformanceObserver(list => {
  const entry = list.getEntries()[0]
  console.log(`Done '${entry.name}'`, entry.duration)
})
observer.observe({ entryTypes: ['measure'], buffered: false })
//Creating the async hook here to piggyback on async calls
const hookContext = new Map()
const hook = AsyncHooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    // each time a resource is init, if the parent resource was associated with a context,
    // we associate the child resource to the same context
    if (hookContext.has(triggerAsyncId)) {
      hookContext.set(asyncId, hookContext.get(triggerAsyncId))
    }
  },
  destroy(asyncId) {
    // this prevents memory leaks
    if (hookContext.has(asyncId)) {
      hookContext.delete(asyncId)
    }
  },
})
hook.enable()

// make un-handled promise rejections throw and end Nodejs process.
process.on('unhandledRejection', error => {
  throw error
})

export async function build({ entryNodeKey, taskContextName /*The object of tasks to use as reference from database graph*/, targetProject /*passed through scriptManager*/ }) {
  assert(entryNodeKey, `• No entryNodeKey for graph traversal was passed.`)
  const targetProjectRoot = targetProject.configuration.rootPath
  // pass variables through the context object.
  let contextInstance = new Context.clientInterface({
    targetProjectConfig: targetProject.configuration.configuration,
    functionContext: require('./function/' + taskContextName), // tasks context object
    conditionContext: require('./function/condition.js'),
  })
  let configuredGraph = Graph.clientInterface({
    parameter: [{ concreteBehaviorList: [contextInstance] }],
  })
  let graph = new configuredGraph({})
  graph.traversal.processData['executeFunctionReference'] = measurePerformanceProxy(graph.traversal.processData['executeFunctionReference']) // manipulate processing implementation callback

  try {
    let result = await graph.traverse({ nodeKey: entryNodeKey, implementationKey: { processData: 'executeFunctionReference', evaluatePosition: 'evaluateConditionReference' } })
  } catch (error) {
    console.error(error)
    await graph.database.driverInstance.close()
    process.exit()
  }
  // let result = graph.traverse({ nodeKey: '9160338f-6990-4957-9506-deebafdb6e29' })
  await graph.database.driverInstance.close()
}

const measurePerformanceProxy = callback =>
  new Proxy(callback, {
    async apply(target, thisArg, argumentList) {
      let { node } = argumentList[0]

      const id = AsyncHooks.executionAsyncId() // this returns the current asynchronous context's id
      hookContext.set(id, node)
      performance.mark('start' + id)

      let result = await Reflect.apply(...arguments)

      performance.mark('end' + id)
      performance.measure(node.properties.name || 'Node ID: ' + node.identity, 'start' + id, 'end' + id)

      return result
    },
  })
