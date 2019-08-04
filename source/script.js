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
    targetProjectConfiguration: targetProject.configuration.configuration,
    taskContext: require('./task/' + taskContextName),
  })
  let configuredGraph = Graph.clientInterface({
    parameter: [{ concreteBehaviorList: [contextInstance] }],
  })
  let graph = new configuredGraph({})
  graph.traversal.processData['executeTaskReference'] = executeTaskReference // add data processing implementation callback
  graph.traversal.evaluatePosition['evaluationExecution'] = evaluationExecution

  try {
    let result = await graph.traverse({ nodeKey: entryNodeKey, implementationKey: { processData: 'executeTaskReference', evaluatePosition: 'evaluationExecution' } })
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
  let taskContext = graphInstance.context.taskContext
  assert(targetProjectConfiguration, `• Context "targetProjectConfiguration" variable is required to run project dependent tasks.`)
  assert(taskContext, `• Context "taskContext" variable is required to reference tasks from graph database strings.`)

  if (resourceRelation) {
    assert(resourceRelation?.connection.properties?.context == 'applicationReference', `• Unsupported resourceRelation context property.`)
    assert(resourceRelation.destination.labels.includes('Task'), `• Unsupported Node type for resource connection.`)
    let resourceNode = resourceRelation.destination
    let taskName = resourceNode.properties.functionName || throw new Error(`• Task resource must have a "functionName" - ${resourceNode.properties.functionName}`)
    let taskFunction = taskContext[taskName] || throw new Error(`• reference task name doesn't exist.`)
    try {
      await taskFunction(targetProjectConfiguration)
    } catch (error) {
      console.error(error) && process.exit()
    }
  }

  performance.mark('end' + id)
  performance.measure(node.properties.name || 'Node ID: ' + node.identity, 'start' + id, 'end' + id)
}

async function evaluationExecution({ node, evaluationNode, executeNode, graphInstance }) {
  let context = graphInstance.context
  console.log(executeNode)
  return false
}
