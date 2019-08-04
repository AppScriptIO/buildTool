/** Condition parameter hierarchy for evaluating a node and deciding which evaluation configuration to use:
 * 1. immediate value `switchValue` property of the evaluation node (this is an internal implementation).
 * 2. Directly passed parameters that would end up in the `graphInstance.context`
 * 3. Project configuration values that would be checked.
 */

import assert from 'assert'

export const shouldTranspile = ({ node, context }) => {
  // Requires `context.targetProjectConfig` property to be provided.
  let targetProjectConfig = context?.targetProjectConfig
  assert(targetProjectConfig, `• Context "targetProjectConfig" variable is required to run project dependent conditions.`)
  console.log(node)
  return false
}
