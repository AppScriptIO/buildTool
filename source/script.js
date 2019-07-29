// 😄 This file is used to define Gulp tasks with source path and destination path. While gulp_includeNodeModules.js is used to save the functions for the build.

import path from 'path'
import assert from 'assert'
import { PerformanceObserver, performance } from 'perf_hooks'
import AsyncHooks from 'async_hooks'
import ownConfiguration from '../configuration'
import { Graph as GraphModule, Context as ContextModule } from '@dependency/graphTraversal'
const { Graph } = GraphModule
const { Context } = ContextModule
import * as task from './task.js'

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
//The performance observer is not changed
const observer = new PerformanceObserver(list => {
  const entry = list.getEntries()[0]
  console.log(`Done '${entry.name}'`, entry.duration)
})
observer.observe({ entryTypes: ['measure'], buffered: false })

export async function build({ targetProject }) {
  const targetProjectRoot = targetProject.configuration.rootPath
  const destinationPath = path.join(targetProjectRoot, 'output')
  const ignoreNodeModuleMatcher = `!node_modules/**/*`

  // pass variables through the context object.
  let contextInstance = new Context.clientInterface({})
  let configuredGraph = Graph.clientInterface({ parameter: [{ concreteBehaviorList: [contextInstance] }] })
  let graph = new configuredGraph({})

  // add data processing implementation callback
  const implementationName = 'transformPipeline'
  graph.traversal.processData[implementationName] = async ({ node, resourceRelation, graphInstance }) => {
    const id = AsyncHooks.executionAsyncId() // this returns the current asynchronous context's id
    hookContext.set(id, node)
    performance.mark('start' + id)

    if (resourceRelation) {
      assert(resourceRelation?.connection.properties?.context == 'applicationReference', `• Unsupported resourceRelation context property.`)
      assert(resourceRelation.destination.labels.includes('Task'), `• Unsupported Node type for resource connection.`)

      let resourceNode = resourceRelation.destination
      let taskName = resourceNode.properties.functionName || throw new Error(`• Task resource must have a "functionName" - ${resourceNode.properties.functionName}`)
      let taskFunction = task[taskName] || throw new Error(`• reference task name doesn't exist.`)
      await taskFunction(targetProject.configuration.configuration)
    }

    performance.mark('end' + id)
    performance.measure(node.properties.name || 'NodeID-' + node.properties.id, 'start' + id, 'end' + id)
  }

  try {
    let result = await graph.traverse({ nodeKey: '5a7c4139-2ce8-4f3b-89e2-47a5f3286e60', implementationKey: { processData: implementationName } })
    console.log(result)
  } catch (error) {
    console.error(error)
    await graph.database.driverInstance.close()
  }
  // let result = graph.traverse({ nodeKey: '9160338f-6990-4957-9506-deebafdb6e29' })
  await graph.database.driverInstance.close()
}
