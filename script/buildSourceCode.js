import filesystem from 'fs'
import path from 'path'
import { build } from '../'
import { removeSync } from 'fs-extra'

// build process for Javascript module repositories
export async function moduleProject(...args) {
  // adapter for working with target function interface of `scriptManager`.
  const { api /* supplied by scriptManager */ } = args[0]
  args[0].targetProject = api.project
  args[0].entryNodeKey ||= '171d18f8-9d25-4483-aeb9-a29c9fbed6ac' // graph tasks traversal entrypoint
  args[0].taskContextName = 'moduleProjectTask'

  let distributionPath = api.project.configuration.configuration.directory.distribution
  if (filesystem.existsSync(distributionPath)) removeSync(distributionPath) // delete existing destribution folder

  await build(...args).catch(console.error)
}
