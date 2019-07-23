import plumber from 'gulp-plumber'
import size from 'gulp-size'
import cleanCss from 'gulp-clean-css'
const cssSlam = require('css-slam')
import autoprefixer from 'gulp-autoprefixer'

// Other browesers configuration :
// var AUTOPREFIXER_BROWSERS = ['last 2 versions', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];
let AUTOPREFIXER_BROWSERS = ['ie >= 10', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4.4', 'bb >= 10']

export const cssFileRegex = /\.css$/

export const fragmentPipeline = () => [
  // wrapped with function to produce a separate instance on invocation
  cssSlam.gulp(),
  cleanCss(),
]

export function pipeline() {
  return [
    plumber(),
    // autoprefixer({
    //   browsers: AUTOPREFIXER_BROWSERS,
    //   cascade: false
    // }),
    ...fragmentPipeline(),
    size({ title: 'CSS' }),
  ]
}
