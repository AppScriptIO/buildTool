import assert from 'assert'
import path from 'path'
const normalizeArray = array => array.map(p => path.normalize(p))

/** Condition parameter hierarchy for evaluating a node and deciding which evaluation configuration to use:
 * 1. immediate value `switchValue` property of the evaluation node (this is an internal implementation).
 * 2. Directly passed parameters that would end up in the `graphInstance.context`
 *    e.g. `yarn run scriptManager shouldCompileScript=true JSProject/buildSourceCode ".moduleProject({}, {compile: ['./test']})"`
 * 3. Project configuration values that would be checked
 *    e.g. `project.configuration.build.compile = ['./source', './script' ]`
 */
export const shouldTranspile = ({ node, context }) => {
  // Requires `context.targetProjectConfig` property to be provided.
  let argumentObject = context?.argumentObject // directly passed parameters
  let targetProjectConfig = context?.targetProjectConfig // parameters in the configuration file.
  assert(targetProjectConfig, `• Context "targetProjectConfig" variable is required to run project dependent conditions.`)
  let currentNodeDirectory = node.properties?.relativePath && path.normalize(node.properties.relativePath)
  assert(currentNodeDirectory, `• relativePath must exist on stage node that uses this condition for evaluation.`)
  let parameterCompileArray = argumentObject?.compile || [] |> normalizeArray
  let configCompileArray = targetProjectConfig.build?.compile || [] |> normalizeArray

  return [...parameterCompileArray, ...configCompileArray].includes(currentNodeDirectory)
}
