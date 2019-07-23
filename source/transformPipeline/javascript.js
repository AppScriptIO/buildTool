import path from 'path'
import sourcemaps from 'gulp-sourcemaps'
import concat from 'gulp-concat'
import { FragmentIndentation } from '@dependency/fragmentIndentationObjectStream'
import babel from 'gulp-babel'
import debug from 'gulp-debug'
import size from 'gulp-size'
import jsMinify from 'gulp-uglify'
import { getBabelConfig } from '@dependency/javascriptTranspilation'

export const jsFileRegex = /\.js$/

export function fragmentPipeline({
  babelPreset,
  babelPlugin, // babel configurations
  shouldSourceMap = true,
}) {
  let pipeline = [
    babel({
      presets: babelPreset,
      plugins: babelPlugin,
      babelrc: false,
    }),
    // jsMinify() // causes issues with some non-native syntax. Using babel minify preset instead.
  ]

  if (shouldSourceMap) {
    pipeline.unshift(sourcemaps.init())
    pipeline.push(sourcemaps.write('.'))
  }

  return pipeline
}

export function clientJSPipeline({ babelConfigFileName = 'nativeClientSideBuild.BabelConfig.js' } = {}) {
  const babelConfig = getBabelConfig(babelConfigFileName)
  let pipeline = [
    debug({ title: 'clientJS:' }),
    FragmentIndentation.TransformToFragmentKeys(),
    ...fragmentPipeline({ babelPreset: babelConfig.presets, babelPlugin: babelConfig.plugins, shouldSourceMap: true }), // previous error handling - .pipe().on('error', function(e) { console.log('>>> ERROR', e); this.emit('end'); })
    FragmentIndentation.TransformBackToFragment(),
    size({ title: `JAVASCRIPT - clientJS using ${babelConfigFileName}` }),
  ]
  return pipeline
}

export function serverJSPipeline({ babelConfigFileName = 'serverBuild.BabelConfig.js' } = {}) {
  const babelConfig = getBabelConfig(babelConfigFileName)
  return [...fragmentPipeline({ babelPreset: babelConfig.presets, babelPlugin: babelConfig.plugins, shouldSourceMap: true }), size({ title: 'Javascript - serverJS' })]
}
