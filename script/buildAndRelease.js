import { buildAndRelease, packageVersion, release } from '@dependency/deploymentScript'
import { memgraphContainer } from '@dependency/deploymentProvisioning'
import { moduleProject as buildModuleProject } from './buildSourceCode.js'
const { bumpVersion } = packageVersion
const { createGithubBranchedRelease } = release

export async function moduleProject({ api, tagName }) {
  let distributionPath = api.project.configuration.configuration.directory.distribution
  if (filesystem.existsSync(distributionPath)) removeSync(distributionPath) // delete existing destribution folder to prevent loading the distribution code instead of the source (in this case it transpiles its own repository).

  memgraphContainer.runDockerContainer() // run memgraph container for usage in buildTool graphTraversal module.
  let version = await bumpVersion({ api })
  await createGithubBranchedRelease({
    api,
    tagName: tagName || version,
    buildCallback: () => buildModuleProject({ api }),
  })
}
