import size from 'gulp-size'
import imagemin from 'gulp-imagemin'

export const fragmentPipeline = () => [imagemin({ progressive: true, interlaced: true })]

export function pipeline() {
  return [...fragmentPipeline(), size({ title: 'imageOptimizeTask' })]
}
