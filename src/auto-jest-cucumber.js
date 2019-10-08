import callerCallsite from 'caller-callsite';
import path from 'path';
import fs from 'fs';

import feature from './feature';
import steps from './steps';

function walk(folder, featureExtension, stepsExtension, stepsSubdir, ignore) {
  const _featureExtension = featureExtension;
  const _stepsExtension = stepsExtension;
  const _stepsSubdir = stepsSubdir;
  const _ignore = ignore;
  const foldersArray = [folder];
  const matchersArray = [
    []
  ];
  const definitionsArray = [
    []
  ];
  do {
    const thisFolder = foldersArray.shift();
    const thisMatchers = matchersArray.shift();
    const thisDefinitions = definitionsArray.shift();
    const entries = fs.readdirSync(thisFolder, {
      withFileTypes: true
    }).filter(entry =>
      !_ignore.reduce((ignored, pattern) => ignored || new RegExp(pattern).test(thisFolder + '/' + entry.name), false));
    const {
      matchers,
      definitions
    } = steps(_stepsSubdir ? {
        folder: thisFolder + '/' + _stepsSubdir,
        stepsExtension: _stepsExtension,
        ignore: _ignore
      } :
      entries.filter(entry => entry.isFile() && entry.name.endsWith(_stepsExtension)).map(entry => thisFolder + '/' + entry.name),
      thisMatchers, thisDefinitions);
    feature(entries.filter(entry => entry.isFile() && entry.name.endsWith(_featureExtension)).map(entry => thisFolder + '/' + entry.name),
      matchers, definitions);
    const dirs = entries.filter(entry => entry.isDirectory());
    for (let d = 0; d < dirs.length; ++d) {
      foldersArray.push(thisFolder + '/' + dirs[d].name);
      matchersArray.push(matchers);
      definitionsArray.push(definitions);
    }
  } while (foldersArray.length > 0);
}

export default (options = {}) => {
  const {
    root = ".",
      featureExtension = ".feature",
      stepsExtension = "steps.js",
      stepsSubdir = "features",
      ignore = [
        "node_modules",
        /\/\..*/
      ]
  } = options;

  let absRoot = callerCallsite().getFileName().replace(/\\/g, '/');
  absRoot = path.resolve(absRoot.substr(0, absRoot.lastIndexOf('/')), root).replace(/\\/g, '/');

  walk(absRoot, featureExtension, stepsExtension, stepsSubdir, ignore);
};