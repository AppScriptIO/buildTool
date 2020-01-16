import path from 'path'
import { promises as filesystem } from 'fs'
import assert from 'assert'
import util from 'util'
import stream from 'stream'
const pipeline = util.promisify(stream.pipeline)
import mergeStream from 'merge-stream'
import rimrafCallback from 'rimraf'
const rimraf = util.promisify(rimrafCallback)
// https://github.com/gulpjs/vinyl-fs#destfolder-options & https://gulpjs.com/docs/en/api/src
import { src as readFileAsObjectStream, dest as writeFileFromObjectStream } from 'vinyl-fs'
import original_wildcardPathnameMatcher from 'glob' // Alternative modules - `globby`, `glob`, `glob-stream`
const wildcardPathnameMatcher = util.promisify(original_wildcardPathnameMatcher)
import * as provision from '@dependency/deploymentProvisioning'
import { pipeline as htmlPipeline } from '../transformPipeline/html.js'
import { pipeline as imagePipeline } from '../transformPipeline/image.js'
import { clientJSPipeline, serverJSPipeline } from '../transformPipeline/javascript.js'
import { pipeline as jsonPipeline } from '../transformPipeline/json.js'
import { pipeline as stylesheetPipeline } from '../transformPipeline/stylesheet.js'
import { convertArrayToMultiplePatternGlob } from '../utility/convertArrayToMultiplePatternGlob.js'
import { transpileSourcePath } from '@dependency/javascriptTranspilation'
const packageDependencyPatternMatch = '**/@package*/**/*', // `@package/...` `@package-x/...`
  nodeModulePatternMatch = '**/node_modules/**/*'

export const module_installYarn = ({ node, traverser }) => {
  let targetProjectConfig = traverser.context.targetProjectConfig || throw new Error(`• traverser.context "targetProjectConfig" variable is required to run project dependent tasks.`)
  provision.installUsingPackageManager.installYarn({ yarnPath: path.join(targetProjectConfig.directory.source) })
}

export const removeDistributionFolder = async ({ node, traverser }) => {
  let targetProjectConfig = traverser.context.targetProjectConfig || throw new Error(`• traverser.context "targetProjectConfig" variable is required to run project dependent tasks.`)
  // https://pubs.opengroup.org/onlinepubs/9699919799/functions/rmdir.html
  // https://www.unix.com/man-page/posix/3posix/rmdir/
  let fileStat = await filesystem.lstat(targetProjectConfig.directory.distribution).catch(error => (error.code == 'ENOENT' ? false : console.error(error)))
  if (fileStat && fileStat.isDirectory()) await rimraf(targetProjectConfig.directory.distribution, { disableGlob: false })
  // create an empty distribution folder
  await filesystem.mkdir(targetProjectConfig.directory.distribution, { recursive: true })
}

export const copyYarnLockfile = async ({ node, traverser }) => {
  let targetProjectConfig = traverser.context.targetProjectConfig || throw new Error(`• traverser.context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let filePath = path.join(targetProjectConfig.directory.root, 'yarn.lock')
  let fileStat = await filesystem.lstat(filePath).catch(error => (error.code == 'ENOENT' ? false : console.error(error)))
  if (fileStat && fileStat.isFile()) await provision.synchronize.copyFileAndSymlink({ source: filePath, destination: targetProjectConfig.directory.distribution })
}

export const transpilePackageDependency = async ({ node, traverser }) => {
  let targetProjectConfig = traverser.context.targetProjectConfig || throw new Error(`• traverser.context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let sourceRelativePath = './package.json'
  await transpileSourcePath({ source: sourceRelativePath, destination: targetProjectConfig.directory.distribution, basePath: targetProjectConfig.directory.root })
  // remove dev dependenices
  // TODO: - remove dev dependencies from package.json.
}

export const transpileTarget = async ({ node, traverser }) => {
  let targetProjectConfig = traverser.context.targetProjectConfig || throw new Error(`• traverser.context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let sourceRelativePath = node.properties?.relativePath || throw new Error(`• relativePath must exist on stage node that uses this condition for evaluation.`)
  return await transpileSourcePath({ source: sourceRelativePath, destination: targetProjectConfig.directory.distribution, basePath: targetProjectConfig.directory.root })
}

export const entrypointProgrammaticAPI = async ({ node, traverser }) => {
  let targetProjectConfig = traverser.context.targetProjectConfig || throw new Error(`• traverser.context "targetProjectConfig" variable is required to run project dependent tasks.`)

  let enrtypointKey = 'programmaticAPI'
  if (!targetProjectConfig?.entrypoint || !targetProjectConfig?.entrypoint[enrtypointKey]) return

  let scriptTargetFile = path.join(targetProjectConfig.directory.source, targetProjectConfig.entrypoint[enrtypointKey])
  let entrypointFolder = path.join(targetProjectConfig.directory.root, `./entrypoint/${enrtypointKey}`)

  // path to the target script file from the entrypoint file.
  let relativeTargetFile = path.relative(entrypointFolder, scriptTargetFile)

  let destinationFolder = path.join(targetProjectConfig.directory.distribution, path.relative(targetProjectConfig.directory.root, entrypointFolder))
  await filesystem.mkdir(destinationFolder, { recursive: true }) // create folder recursively

  // create entrypoint
  let filePath = path.join(destinationFolder, 'index.js')
  let content = `module.exports = require('${relativeTargetFile}')`
  await filesystem.appendFile(filePath, content, { encoding: 'utf8' })
}

export const entryointCLI = async ({ node, traverser }) => {
  let targetProjectConfig = traverser.context.targetProjectConfig || throw new Error(`• traverser.context "targetProjectConfig" variable is required to run project dependent tasks.`)

  let enrtypointKey = 'cli'
  if (!targetProjectConfig?.entrypoint || !targetProjectConfig?.entrypoint[enrtypointKey]) return

  let scriptTargetFile = path.join(targetProjectConfig.directory.source, targetProjectConfig.entrypoint[enrtypointKey])
  let entrypointFolder = path.join(targetProjectConfig.directory.root, `./entrypoint/${enrtypointKey}`)

  // path to the target script file from the entrypoint file.
  let relativeTargetFile = path.relative(entrypointFolder, scriptTargetFile)

  let destinationFolder = path.join(targetProjectConfig.directory.distribution, path.relative(targetProjectConfig.directory.root, entrypointFolder))
  await filesystem.mkdir(destinationFolder, { recursive: true }) // create folder recursively

  // create entrypoint
  let filePath = path.join(destinationFolder, 'index.js')
  let content = `module.exports = require('${relativeTargetFile}')`
  content = `#\!/usr/bin/env node\n` + content
  await filesystem.appendFile(filePath, content, { encoding: 'utf8' })
}
