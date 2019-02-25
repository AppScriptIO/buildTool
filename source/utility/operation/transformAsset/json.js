import jsonMinify from 'gulp-jsonminify'
import size from 'gulp-size'

export const fragmentPipeline = [
    jsonMinify()
]

export function pipeline() {
    return [
        ...fragmentPipeline,
        size({ title: 'json' })
    ]
}