import path from 'path'
import ifType from 'gulp-if'
import babel from 'gulp-babel'
import merge from 'merge-stream'
import size from 'gulp-size'
import htmlmin from 'gulp-htmlmin'
import { HtmlSplitter } from 'polymer-build'
import { FragmentIndentation } from '@dependency/fragmentIndentationObjectStream'
import { pipeline as _cssPipeline, cssFileRegex } from './stylesheet.js'
import { clientJSPipeline, jsFileRegex } from './javascript.js'

const fragmentRegex = {
  ignoreCustomFragments: [/{%[\s\S]*?%}/, /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/],
  hbAttrWrap: {
    open: /\{\{(#|\^)[^}]+\}\}/,
    close: /\{\{\/[^}]+\}\}/,
  },
}

export const htmlFileRegex = /\.html$/

// for html fragments only, without css and js parts.
export const fragmentPipeline = () => [
  htmlmin({
    collapseWhitespace: true,
    removeComments: true,
    removeCommentsFromCDATA: true,
    minifyURLs: true,
    minifyJS: true,
    minifyCSS: true,
    ignoreCustomFragments: fragmentRegex.ignoreCustomFragments,
  }),
]

export function pipeline({
  // array of file object streams (vinyl transformers)
  jsPipeline = clientJSPipeline(),
  cssPipeline = _cssPipeline(),
  htmlPipeline = fragmentPipeline(),
} = {}) {
  const sourcesHtmlSplitter = new HtmlSplitter()

  return [
    // Split
    FragmentIndentation.TransformToFragmentKeys(), // temporarly remove server side indentation e.g. server side template indentations
    sourcesHtmlSplitter.split(), // split inline JS & CSS out into individual .js & .css files

    /* JAVASCRIPT */
    ifType(jsFileRegex, ...jsPipeline),

    /* HTML (also minimize any left or non detected sections - css, js, html tags that were not separated), e.g. css's transform property  */
    ifType(htmlFileRegex, ...htmlPipeline),

    /* CSS */
    ifType(cssFileRegex, ...cssPipeline),

    // Re-join those files back into their original location
    sourcesHtmlSplitter.rejoin(),
    FragmentIndentation.TransformBackToFragment(),

    size({ title: `HTML` }),
  ]
}
