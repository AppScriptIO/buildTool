import path from 'path'
import filesystem from 'fs'
import assert from 'assert'
import util from 'util'
import stream from 'stream'
import ownConfiguration from '../configuration'
const pipeline = util.promisify(stream.pipeline)
import mergeStream from 'merge-stream'
import { src as readFileAsObjectStream, dest as writeFileFromObjectStream } from 'vinyl-fs'
import wildcardPathnameMatcher from 'globby'
import { installJspm } from '@dependency/deploymentScript/script/provisionOS/installESModule/install-jspm.js'
import { installYarn } from '@dependency/deploymentScript/script/provisionOS/installESModule/install-yarn.js'
import { installNpm } from '@dependency/deploymentScript/script/provisionOS/installESModule/install-npm.js'
import { recursivelySyncFile } from '@dependency/deploymentScript/source/utility/filesystemOperation/synchronizeFile.js'
import { pipeline as htmlPipeline } from './transformPipeline/html.js'
import { pipeline as imagePipeline } from './transformPipeline/image.js'
import { clientJSPipeline, serverJSPipeline } from './transformPipeline/javascript.js'
import { pipeline as jsonPipeline } from './transformPipeline/json.js'
import { pipeline as stylesheetPipeline } from './transformPipeline/stylesheet.js'
const ignorePackageDependency = '!' + '**/@package/**/*',
  ignoreNodeModule = '!' + '**/node_modules/**/*'

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
export const clientSide_jspm = targetProjectConfig => installJspm({ jspmPath: path.join(targetProjectConfig.directory.source, '/packageManager/library.browser.jspm') })

export const clientSide_webcomponentYarn = targetProjectConfig => installYarn({ yarnPath: path.join(targetProjectConfig.directory.source, '/packageManager/webcomponent.browser.yarn/') })

export const clientSide_libraryYarn = targetProjectConfig => installYarn({ yarnPath: path.join(targetProjectConfig.directory.source, '/packageManager/library.browser.yarn/') })

/*
                 _   _            ____ _ _            _   ____  _     _      
     _ __   __ _| |_(_)_   _____ / ___| (_) ___ _ __ | |_/ ___|(_) __| | ___ 
    | '_ \ / _` | __| \ \ / / _ \ |   | | |/ _ \ '_ \| __\___ \| |/ _` |/ _ \
    | | | | (_| | |_| |\ V /  __/ |___| | |  __/ | | | |_ ___) | | (_| |  __/
    |_| |_|\__,_|\__|_| \_/ \___|\____|_|_|\___|_| |_|\__|____/|_|\__,_|\___|
*/
export const nativeClientSide_copySourceCode = async targetProjectConfig =>
  await recursivelySyncFile({
    source: targetProjectConfig.directory.clientSide,
    destination: targetProjectConfig.distribution.clientSide.native,
    copyContentOnly: true,
  })

export const nativeClientSide_json = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([path.join(targetProjectConfig.directory.clientSide, '/**/*.json'), ignorePackageDependency])
  if (fileArray.length) await pipeline(readFileAsObjectStream(fileArray), ...jsonPipeline(), writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.native))
}

export const nativeClientSide_html = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([path.join(targetProjectConfig.directory.clientSide, '/**/*.html'), ignorePackageDependency])
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray),
      ...htmlPipeline({ babelConfigFileName: 'nativeClientSideBuild.BabelConfig.js' }),
      writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.native),
    )
}

export const nativeClientSide_stylesheet = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([path.join(targetProjectConfig.directory.clientSide, '/**/*.css'), ignorePackageDependency])
  if (fileArray.length) await pipeline(readFileAsObjectStream(fileArray), ...stylesheetPipeline(), writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.native))
}

export const nativeClientSide_javascript = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([
    path.join(targetProjectConfig.directory.clientSide, '/**/*.js'), // including package js to allow named import path transformation.
    ignorePackageDependency,
    // include compoennt in specific case
    // path.join(targetProjectConfig.directory.clientSide, '/**/webcomponent/@package/@polymer/**/*.js'),
    // '!' + path.join(targetProjectConfig.directory.clientSide, '/**/webcomponent/@package/@polymer/**/bower_components/**/*.js'), // polymer 3 contains a bower_components folder.
  ])
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray),
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
export const polyfillClientSide_copySourceCode = targetProjectConfig =>
  recursivelySyncFile({ source: targetProjectConfig.directory.clientSide, destination: targetProjectConfig.distribution.clientSide.polyfill, copyContentOnly: true })

export const polyfillClientSide_json = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([path.join(targetProjectConfig.directory.clientSide, '/**/*.json'), ignorePackageDependency])
  if (fileArray.length) await pipeline(readFileAsObjectStream(fileArray), ...jsonPipeline(), writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.polyfill))
}

export const polyfillClientSide_html = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([path.join(targetProjectConfig.directory.clientSide, '/**/*.html'), ignorePackageDependency])
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray),
      ...htmlPipeline({ babelConfigFileName: 'polyfillClientSideBuild.BabelConfig.js' }),
      writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.polyfill),
    )
}

export const polyfillClientSide_stylesheet = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([path.join(targetProjectConfig.directory.clientSide, '/**/*.css'), ignorePackageDependency])
  if (fileArray.length) await pipeline(readFileAsObjectStream(fileArray), ...stylesheetPipeline(), writeFileFromObjectStream(targetProjectConfig.distribution.clientSide.polyfill))
}

export const polyfillClientSide_javascript = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([
    path.join(targetProjectConfig.directory.clientSide, '/**/*.js'), // including package js to allow named import path transformation.
    ignorePackageDependency,
    // include compoennt in specific case
    // path.join(targetProjectConfig.directory.clientSide, '/**/webcomponent/@package/@polymer/**/*.js'),
    // '!' + path.join(targetProjectConfig.directory.clientSide, '/**/webcomponent/@package/@polymer/**/bower_components/**/*.js'), // polymer 3 contains a bower_components folder.
  ])
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray),
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
export const serverSide_installYarn = targetProjectConfig => installYarn({ yarnPath: path.join(targetProjectConfig.directory.source, '/packageManager/library.server.yarn/') })

export const serverSide_copyServerSide = async targetProjectConfig =>
  await recursivelySyncFile({ source: targetProjectConfig.directory.source.serverSide, destination: targetProjectConfig.distribution.serverSide, copyContentOnly: true })

export const serverSide_copyDatabaseData = async targetProjectConfig =>
  await recursivelySyncFile({
    source: path.join(targetProjectConfig.directory.source, 'databaseData'),
    destination: targetProjectConfig.directory.distribution,
    copyContentOnly: false,
  })

export const serverSide_transpileDatabaseData = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([path.join(targetProjectConfig.directory.source, 'databaseData/**/*.js'), ignoreNodeModule])
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray),
      ...serverJSPipeline({ babelConfigFileName: 'serverBuild.BabelConfig.js', includeSourceMap: false }),
      writeFileFromObjectStream(path.join(targetProjectConfig.directory.distribution, 'databaseData/')),
    )
}

export const serverSide_transpileServerSide = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([path.join(targetProjectConfig.directory.serverSide, '**/*.js'), ignoreNodeModule])
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray),
      ...serverJSPipeline({ babelConfigFileName: 'serverBuild.BabelConfig.js', includeSourceMap: false }),
      writeFileFromObjectStream(targetProjectConfig.distribution.serverSide),
    )
}

export const serverSide_transpileAppscript = async targetProjectConfig => {
  let fileArray = await wildcardPathnameMatcher([
    path.join(targetProjectConfig.directory.serverSide, 'node_modules/appscript/**/*.js'),
    '!' + path.join(targetProjectConfig.directory.serverSide, 'node_modules/appscript/node_modules/**/*.js'),
  ])
  if (fileArray.length)
    await pipeline(
      readFileAsObjectStream(fileArray),
      ...serverJSPipeline({ babelConfigFileName: 'serverBuild.BabelConfig.js', includeSourceMap: false }),
      writeFileFromObjectStream(path.join(targetProjectConfig.distribution.serverSide, 'node_modules/appscript')),
    )
}
