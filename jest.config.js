const {defaults} = require('jest-config');

module.exports = {
  testMatch: [ "<rootDir>/src/features/self.js" ],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>(.*)/node_modules"],
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    "feature"
  ]
};
module.exports.watchPathIgnorePatterns = module.exports.testPathIgnorePatterns;