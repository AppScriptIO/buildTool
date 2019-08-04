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

/**
 * Maps a key to a callback to a task function
 */

/*
        _ _            _   ____  _     _      
    ___| (_) ___ _ __ | |_/ ___|(_) __| | ___ 
   / __| | |/ _ \ '_ \| __\___ \| |/ _` |/ _ \
  | (__| | |  __/ | | | |_ ___) | | (_| |  __/
   \___|_|_|\___|_| |_|\__|____/|_|\__,_|\___|
*/
export const clientSide_jspm = ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  installJspm({ jspmPath: path.join(targetProjectConfig.directory.source, '/packageManager/library.browser.jspm') })
}

export const clientSide_webcomponentYarn = ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  installYarn({ yarnPath: path.join(targetProjectConfig.directory.source, '/packageManager/webcomponent.browser.yarn/') })
}

export const clientSide_libraryYarn = ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  installYarn({ yarnPath: path.join(targetProjectConfig.directory.source, '/packageManager/library.browser.yarn/') })
}

/*
                 _   _            ____ _ _            _   ____  _     _      
     _ __   __ _| |_(_)_   _____ / ___| (_) ___ _ __ | |_/ ___|(_) __| | ___ 
    | '_ \ / _` | __| \ \ / / _ \ |   | | |/ _ \ '_ \| __\___ \| |/ _` |/ _ \
    | | | | (_| | |_| |\ V /  __/ |___| | |  __/ | | | |_ ___) | | (_| |  __/
    |_| |_|\__,_|\__|_| \_/ \___|\____|_|_|\___|_| |_|\__|____/|_|\__,_|\___|
*/
export const nativeClientSide_copySourceCode = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  await recursivelySyncFile({
    source: targetProjectConfig.directory.clientSide,
    destination: targetProjectConfig.distribution.clientSide.native,
    copyContentOnly: true,
  })
}

export const nativeClientSide_json = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.clientSide
  let fileArray = await wildcardPathnameMatcher('**/*.json', { cwd: basePath, absolute: true /*always receive absolute paths*/, ignore: packageDependencyPatternMatch })
  if (fileArray.length) await pipeline(readFileAsObjectStream(fileArray, { base: basePath }), ...jsonPipeline(), writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.native))
}

export const nativeClientSide_html = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.clientSide
  let fileArray = await wildcardPathnameMatcher('**/*.html', { cwd: basePath, absolute: true /*always receive absolute paths*/, ignore: packageDependencyPatternMatch })
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray, { base: basePath }),
      ...htmlPipeline({ babelConfigFileName: 'nativeClientSideBuild.BabelConfig.js' }),
      writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.native),
    )
}

export const nativeClientSide_stylesheet = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.clientSide
  let fileArray = await wildcardPathnameMatcher('**/*.css', { cwd: basePath, absolute: true /*always receive absolute paths*/, ignore: packageDependencyPatternMatch })
  if (fileArray.length) await pipeline(readFileAsObjectStream(fileArray, { base: basePath }), ...stylesheetPipeline(), writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.native))
}

export const nativeClientSide_javascript = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.clientSide
  let fileArray = await wildcardPathnameMatcher(
    [
      '**/*.js',
      // include compoennt in specific case
      // path.join(targetProjectConfig.directory.clientSide, '/**/webcomponent/@package/@polymer/**/*.js'),
    ] |> convertArrayToMultiplePatternGlob, // as the first argument must be a string.
    {
      cwd: basePath,
      absolute: true /*always receive absolute paths*/,
      ignore: [
        packageDependencyPatternMatch,
        // '/**/webcomponent/@package/@polymer/**/bower_components/**/*.js', // polymer 3 contains a bower_components folder.
      ],
    },
  )
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray, { base: basePath }),
      ...serverJSPipeline({ babelConfigFileName: 'nativeClientSideBuild.BabelConfig.js', includeSourceMap: false }),
      writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.native),
    )
}

/*
                 _        __ _ _ _  ____ _ _            _   ____  _     _      
     _ __   ___ | |_   _ / _(_) | |/ ___| (_) ___ _ __ | |_/ ___|(_) __| | ___ 
    | '_ \ / _ \| | | | | |_| | | | |   | | |/ _ \ '_ \| __\___ \| |/ _` |/ _ \
    | |_) | (_) | | |_| |  _| | | | |___| | |  __/ | | | |_ ___) | | (_| |  __/
    | .__/ \___/|_|\__, |_| |_|_|_|\____|_|_|\___|_| |_|\__|____/|_|\__,_|\___|
    |_|            |___/                                                       
*/
export const polyfillClientSide_copySourceCode = ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  recursivelySyncFile({ source: targetProjectConfig.directory.clientSide, destination: targetProjectConfig.distribution.clientSide.polyfill, copyContentOnly: true })
}

export const polyfillClientSide_json = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.clientSide
  let fileArray = await wildcardPathnameMatcher('**/*.json', { cwd: basePath, absolute: true /*always receive absolute paths*/, ignore: packageDependencyPatternMatch })
  if (fileArray.length) await pipeline(readFileAsObjectStream(fileArray, { base: basePath }), ...jsonPipeline(), writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.polyfill))
}

export const polyfillClientSide_html = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.clientSide
  let fileArray = await wildcardPathnameMatcher('**/*.html', { cwd: basePath, absolute: true /*always receive absolute paths*/, ignore: packageDependencyPatternMatch })
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray, { base: basePath }),
      ...htmlPipeline({ babelConfigFileName: 'polyfillClientSideBuild.BabelConfig.js' }),
      writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.polyfill),
    )
}

export const polyfillClientSide_stylesheet = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.clientSide
  let fileArray = await wildcardPathnameMatcher('**/*.css', { cwd: basePath, absolute: true /*always receive absolute paths*/, ignore: packageDependencyPatternMatch })
  if (fileArray.length) await pipeline(readFileAsObjectStream(fileArray, { base: basePath }), ...stylesheetPipeline(), writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.polyfill))
}

export const polyfillClientSide_javascript = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.clientSide
  let fileArray = await wildcardPathnameMatcher(
    [
      '**/*.js',
      // include compoennt in specific case
      // path.join(targetProjectConfig.directory.clientSide, '/**/webcomponent/@package/@polymer/**/*.js'),
    ] |> convertArrayToMultiplePatternGlob,
    {
      cwd: basePath,
      absolute: true /*always receive absolute paths*/,
      ignore: [
        packageDependencyPatternMatch,
        // '/**/webcomponent/@package/@polymer/**/bower_components/**/*.js', // polymer 3 contains a bower_components folder.
      ],
    },
  )
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray, { base: basePath }),
      ...serverJSPipeline({ babelConfigFileName: 'polyfillClientSideBuild.BabelConfig.js', includeSourceMap: false }),
      writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.polyfill),
    )
}

/*
                                  ____  _     _      
     ___  ___ _ ____   _____ _ __/ ___|(_) __| | ___ 
    / __|/ _ \ '__\ \ / / _ \ '__\___ \| |/ _` |/ _ \
    \__ \  __/ |   \ V /  __/ |   ___) | | (_| |  __/
    |___/\___|_|    \_/ \___|_|  |____/|_|\__,_|\___|
*/
export const serverSide_installYarn = ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  installYarn({ yarnPath: path.join(targetProjectConfig.directory.source, '/packageManager/library.server.yarn/') })
}

export const serverSide_copyServerSide = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  await recursivelySyncFile({ source: targetProjectConfig.directory.serverSide, destination: targetProjectConfig.distribution.serverSide, copyContentOnly: true })
}

export const serverSide_copyDatabaseData = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  await recursivelySyncFile({
    source: path.join(targetProjectConfig.directory.source, 'databaseData'),
    destination: targetProjectConfig.directory.distribution,
    copyContentOnly: false,
  })
}

export const serverSide_transpileDatabaseData = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.source
  let fileArray = await wildcardPathnameMatcher('databaseData/**/*.js', { cwd: basePath, absolute: true /*always receive absolute paths*/, ignore: nodeModulePatternMatch })
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray, { base: basePath }),
      ...serverJSPipeline({ babelConfigFileName: 'serverBuild.BabelConfig.js', includeSourceMap: false }),
      writeFileFromObjectStream(path.join(targetProjectConfig.directory.distribution, 'databaseData/')),
    )
}

export const serverSide_transpileServerSide = async ({ node, context }) => {
  let targetProjectConfig = context.targetProjectConfig || throw new Error(`• Context "targetProjectConfig" variable is required to run project dependent tasks.`)
  let basePath = targetProjectConfig.directory.serverSide
  let fileArray = await wildcardPathnameMatcher('**/*.js', { cwd: basePath, absolute: true /*always receive absolute paths*/, ignore: nodeModulePatternMatch })
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray, { base: basePath }),
      ...serverJSPipeline({ babelConfigFileName: 'serverBuild.BabelConfig.js', includeSourceMap: false }),
      writeFileFromObjectStream(targetProjectConfig.distribution.serverSide),
    )
}
