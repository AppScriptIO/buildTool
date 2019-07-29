// 😄 This file is used to define Gulp tasks with source path and destination path. While gulp_includeNodeModules.js is used to save the functions for the build.

import path from 'path'
import filesystem from 'fs'
import util from 'util'
import stream from 'stream'
const pipeline = util.promisify(stream.pipeline)
import mergeStream from 'merge-stream'
import { src as readFileAsObjectStream, dest as writeFileFromObjectStream } from 'vinyl-fs'
import wildcardPathnameMatcher from 'globby'
import ownConfiguration from '../configuration'
import { Graph as GraphModule, Context as ContextModule } from '@dependency/graphTraversal'
const { Graph } = GraphModule
const { Context } = ContextModule
import { pipeline as cssPipeline } from './transformPipeline/stylesheet.js'
import { serverJSPipeline } from './transformPipeline/javascript.js'
import { pipeline as htmlPipeline } from './transformPipeline/html.js'
import { installNpm } from '@dependency/deploymentScript/script/provisionOS/installESModule/install-npm.js'
import { recursivelySyncFile } from '@dependency/deploymentScript/source/utility/filesystemOperation/synchronizeFile.js'

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
  graph.traversal.processData[implementationName] = ({ node, graphInstance }) => {}

  try {
    let result = await graph.traverse({ nodeKey: '58c15cc8-6f40-4d0b-815a-0b8594aeb972', implementationKey: { processData: implementationName } })
    console.log(result)
  } catch (error) {
    console.error(error)
    await graph.database.driverInstance.close()
  }
  // let result = graph.traverse({ nodeKey: '9160338f-6990-4957-9506-deebafdb6e29' })
  await graph.database.driverInstance.close()
}

async function b() {
  let cssFileArray = await wildcardPathnameMatcher([path.join(targetProjectRoot, 'source', '**/*.css')])
  let jsFileArray = await wildcardPathnameMatcher([path.join(targetProjectRoot, 'source', '**/*.js')])
  let htmlFileArray = await wildcardPathnameMatcher([path.join(targetProjectRoot, 'source', '**/*.html')])
  if (cssFileArray.length) await pipeline(readFileAsObjectStream(cssFileArray), ...cssPipeline(), writeFileFromObjectStream(destinationPath))
  if (jsFileArray.length) await pipeline(readFileAsObjectStream(jsFileArray), ...serverJSPipeline(), writeFileFromObjectStream(destinationPath))
  if (htmlFileArray.length) await pipeline(readFileAsObjectStream(htmlFileArray), ...htmlPipeline(), writeFileFromObjectStream(destinationPath))
  await installNpm({ npmPath: path.join(targetProjectRoot, 'input/') })
  await recursivelySyncFile({ source: path.join(targetProjectRoot, 'input'), destination: path.join(targetProjectRoot, 'output/rsync2'), copyContentOnly: true })
}
