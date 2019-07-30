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

export async function build({ entrtNodeKey = '58c15cc8-6f40-4d0b-815a-0b8594aeb972', targetProject /*passed through scriptManager*/ }) {
  const targetProjectRoot = targetProject.configuration.rootPath

  // pass variables through the context object.
  let contextInstance = new Context.clientInterface({
    targetProjectConfiguration: targetProject.configuration.configuration,
  })
  let configuredGraph = Graph.clientInterface({ parameter: [{ concreteBehaviorList: [contextInstance] }] })
  let graph = new configuredGraph({})
  graph.traversal.processData['executeTaskReference'] = executeTaskReference // add data processing implementation callback

  try {
    let result = await graph.traverse({ nodeKey: entrtNodeKey, implementationKey: { processData: 'executeTaskReference' } })
  } catch (error) {
    console.error(error)
    await graph.database.driverInstance.close()
    process.exit()
  }
  // let result = graph.traverse({ nodeKey: '9160338f-6990-4957-9506-deebafdb6e29' })
  await graph.database.driverInstance.close()
}

/**
 * `processData` implementation of `graphTraversal` module
 * Requires `context.targetProjectConfiguration` property to be passed.
 * Executes tasks through a string reference from the database that match the key of the application task context object (task.js exported object).
 */
async function executeTaskReference({ node, resourceRelation, graphInstance }) {
  const id = AsyncHooks.executionAsyncId() // this returns the current asynchronous context's id
  hookContext.set(id, node)
  performance.mark('start' + id)

  let targetProjectConfiguration = graphInstance.context.targetProjectConfiguration
  assert(targetProjectConfiguration, `• Context "targetProjectConfiguration" variable is required to run project dependent tasks.`)

  if (resourceRelation) {
    assert(resourceRelation?.connection.properties?.context == 'applicationReference', `• Unsupported resourceRelation context property.`)
    assert(resourceRelation.destination.labels.includes('Task'), `• Unsupported Node type for resource connection.`)
    let resourceNode = resourceRelation.destination
    let taskName = resourceNode.properties.functionName || throw new Error(`• Task resource must have a "functionName" - ${resourceNode.properties.functionName}`)
    let taskFunction = task[taskName] || throw new Error(`• reference task name doesn't exist.`)
    try {
      await taskFunction(targetProjectConfiguration)
    } catch (error) {
      console.error(error) && process.exit()
    }
  }

  performance.mark('end' + id)
  performance.measure(node.properties.name || 'Node ID: ' + node.identity, 'start' + id, 'end' + id)
}
