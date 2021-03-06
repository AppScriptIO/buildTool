// 😄 This file is used to define Gulp tasks with source path and destination path. While gulp_includeNodeModules.js is used to save the functions for the build.

import path from 'path'
import assert from 'assert'
import { PerformanceObserver, performance } from 'perf_hooks'
import AsyncHooks from 'async_hooks'
import { Graph, Context, Database, Traverser } from '@dependency/graphTraversal'
import * as implementation from '@dependency/graphTraversal-implementation'
import * as graphData from '../resource/taskSequence.graph.json'
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

// TODO: Fix webappProject resource data.
export async function build(
  { entryNodeKey, taskContextName /*The object of tasks to use as reference from database graph*/, targetProject /*passed through scriptManager*/, memgraph = {} } = {},
  argumentObject, // second argument holds parameters that maybe used in the node execution functions.
) {
  assert(entryNodeKey, `• No entryNodeKey for graph traversal was passed.`)
  const targetProjectRoot = targetProject.configuration.rootPath

  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: {
      boltCypher: implementation.database.boltCypherModelAdapterFunction({ url: { protocol: 'bolt', hostname: memgraph.host || 'localhost', port: memgraph.port || 7687 } }),
    },
    defaultImplementation: 'boltCypher',
  })

  // pass variables through the context object.
  let contextInstance = new Context.clientInterface({
    data: {
      argumentObject,
      targetProjectConfig: targetProject.configuration.configuration,
      functionReferenceContext: Object.assign(require(path.join(__dirname, './function/' + taskContextName)), require(path.join(__dirname, './function/condition.js'))), // tasks context object
    },
  })
  let configuredTraverser = Traverser.clientInterface({
    parameter: [{ concreteBehaviorList: [contextInstance] }],
  })

  let configuredGraph = Graph.clientInterface({
    parameter: [
      {
        database: concreteDatabaseBehavior,
        configuredTraverser,
        concreteBehaviorList: [],
      },
    ],
  })

  let graph = new configuredGraph.clientInterface({})
  let traverser = new graph.configuredTraverser.clientInterface()
  traverser.implementation.processNode['executeFunctionReference'] = measurePerformanceProxy(traverser.implementation.processNode['executeFunctionReference']) // manipulate processing implementation callback

  assert(Array.isArray(graphData.node) && Array.isArray(graphData.edge), `• Unsupported graph data strcuture- ${graphData.edge} - ${graphData.node}`)
  await graph.load({ graphData })
  console.log(`• Graph in-memory database was cleared and 'resource' graph data was loaded.`)

  try {
    let result = await graph.traverse({ traverser, nodeKey: entryNodeKey, implementationKey: { processNode: 'executeFunctionReference', evaluatePosition: 'evaluateConditionReference' } })
  } catch (error) {
    console.error(error)
    await graph.database.implementation.driverInstance.close()
    process.exit()
  }
  // let result = graph.traverse({ nodeKey: '9160338f-6990-4957-9506-deebafdb6e29' })
  await graph.database.implementation.driverInstance.close()
}

const measurePerformanceProxy = callback =>
  new Proxy(callback, {
    async apply(target, thisArg, argumentList) {
      let { stageNode, processNode } = argumentList[0]

      const id = AsyncHooks.executionAsyncId() // this returns the current asynchronous context's id
      hookContext.set(id, stageNode)
      performance.mark('start' + id)

      let result = await Reflect.apply(...arguments)

      performance.mark('end' + id)
      performance.measure(stageNode.properties.name || 'Node ID: ' + stageNode.identity, 'start' + id, 'end' + id)

      return result
    },
  })
