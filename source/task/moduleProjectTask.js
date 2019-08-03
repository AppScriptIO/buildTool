import path from 'path'
import filesystem from 'fs'
import assert from 'assert'
import util from 'util'
import stream from 'stream'
import ownConfiguration from '../../configuration'
const pipeline = util.promisify(stream.pipeline)
import mergeStream from 'merge-stream'
// https://github.com/gulpjs/vinyl-fs#destfolder-options & https://gulpjs.com/docs/en/api/src
import { src as readFileAsObjectStream, dest as writeFileFromObjectStream } from 'vinyl-fs'
import original_wildcardPathnameMatcher from 'glob' // Alternative modules - `globby`, `glob`, `glob-stream`
const wildcardPathnameMatcher = util.promisify(original_wildcardPathnameMatcher)
import { installJspm } from '@dependency/deploymentScript/script/provisionOS/installESModule/install-jspm.js'
import { installYarn } from '@dependency/deploymentScript/script/provisionOS/installESModule/install-yarn.js'
import { installNpm } from '@dependency/deploymentScript/script/provisionOS/installESModule/install-npm.js'
import { recursivelySyncFile } from '@dependency/deploymentScript/source/utility/filesystemOperation/synchronizeFile.js'
import { pipeline as htmlPipeline } from '../transformPipeline/html.js'
import { pipeline as imagePipeline } from '../transformPipeline/image.js'
import { clientJSPipeline, serverJSPipeline } from '../transformPipeline/javascript.js'
import { pipeline as jsonPipeline } from '../transformPipeline/json.js'
import { pipeline as stylesheetPipeline } from '../transformPipeline/stylesheet.js'
import { convertArrayToMultiplePatternGlob } from '../utility/convertArrayToMultiplePatternGlob.js'
const packageDependencyPatternMatch = '**/@package*/**/*', // `@package/...` `@package-x/...`
  nodeModulePatternMatch = '**/node_modules/**/*'

export const module_installYarn = targetProjectConfig => installYarn({ yarnPath: path.join(targetProjectConfig.directory.source) })

export const removeDistributionFolder = targetProjectConfig => console.log(targetProjectConfig.directory.distribution)

export const transpilePackageDependency = targetProjectConfig => console.log(targetProjectConfig.directory.distribution)

export const copyYarnLockfile = targetProjectConfig => console.log(targetProjectConfig.directory.distribution)

export const transpileSource = targetProjectConfig => console.log(targetProjectConfig.directory.distribution)

export const transpileScript = targetProjectConfig => console.log(targetProjectConfig.directory.distribution)

export const transpileTest = targetProjectConfig => console.log(targetProjectConfig.directory.distribution)

export const entrypointProgrammaticAPI = targetProjectConfig => console.log(targetProjectConfig.directory.distribution)

export const entryointCLI = targetProjectConfig => console.log(targetProjectConfig.directory.distribution)
