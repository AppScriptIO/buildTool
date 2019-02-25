

import filesystem from 'fs'

/** Ensure Files
 * @param {Array<string>} files
 * @param {Function} cb
 */
export function ensureFile(files, cb) {
  var missingFiles = files.reduce(function(accumulator, filePath) {
    var fileFound = false;

    try {
      fileFound = filesystem.statSync(filePath).isFile();
    } catch (e) { /* ignore */ }

    if (!fileFound) {
      accumulator.push(filePath + ' Not Found');
    }

    return accumulator;
  }, []);

  if (missingFiles.length) {
    var err = new Error('Missing Required Files\n' + missingFiles.join('\n'));
  }

  if (cb) {
    cb(err);
  } else if (err) {
    throw err;
  }
};