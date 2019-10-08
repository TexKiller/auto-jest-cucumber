import path from 'path';
import fs from 'fs';

global.__non_webpack_require__ = global.__non_webpack_require__ || eval('require'); // jshint ignore:line

export default (files, matchers, definitions) => {
  if (typeof files.folder === "string") {
    try {
      files = fs.readdirSync(files.folder, {
        withFileTypes: true
      }).filter(entry =>
        entry.isFile() &&
        entry.name.endsWith(files.stepsExtension) &&
        !files.ignore.reduce((ignored, pattern) => ignored || new RegExp(pattern).test(files.folder + '/' + entry.name), false)
      ).map(entry => files.folder + '/' + entry.name);
    } catch (e) {
      if (e.code === 'ENOENT') {
        return {
          matchers,
          definitions
        };
      } else {
        throw e;
      }
    }
  }
  matchers = [...matchers];
  definitions = [...definitions];
  files.forEach(file => {
    const filePath = path.relative(__dirname, file.substr(0, file.lastIndexOf('.'))).replace(/\\/g, '/');
    let steps = __non_webpack_require__((filePath.startsWith('.') ? '' : '../../../src/steps/' /* fixes steps testing */) + filePath);
    steps = steps.default || steps;
    if (steps instanceof Array) {
      steps.forEach(step => {
        let i = matchers.indexOf(step[0]);
        if (i === -1) {
          i = matchers.length;
          matchers[i] = step[0];
        }
        definitions[i] = step[1];
      });
    }
  });
  return {
    matchers,
    definitions
  };
};