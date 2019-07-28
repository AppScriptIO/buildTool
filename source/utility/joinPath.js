const checktype = require('type-of-is')
const path = require('path')

export default function joinPath(mainpath: String, subpath: [String]) {
  if (subpath == null || typeof subpath === 'undefined') return mainpath
  if (checktype(subpath, String)) return path.join(mainpath, subpath)
  else return subpath.map(value => path.join(mainpath, value))
}
