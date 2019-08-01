// Multiple patterns are represented in globs as `{pattern1, pattern2, pattern3}`
export const convertArrayToMultiplePatternGlob = array => (array.length > 1 ? array.join(',') |> (multiplePatternString => `{${multiplePatternString}}`) : array[0])
