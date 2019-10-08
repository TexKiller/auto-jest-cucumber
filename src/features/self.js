import autoJestCucumber from 'auto-jest-cucumber';

autoJestCucumber({
  root: '..',
  ignore: [
    "node_modules",
    /\/\..*/,
    "samples"
  ]
});