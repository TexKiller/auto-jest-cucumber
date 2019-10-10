function wrapper(fun, state) {
  return function () {
    const args = [...arguments].slice(0, arguments.length - 1);
    args.push(state);
    return fun.apply(state, args);
  };
}

export default (files, matchers, definitions) => {
  if (global.mockedJestCucumber) {
    global.loadFeature = mockedJestCucumber.loadFeature;
    global.defineFeature = mockedJestCucumber.defineFeature;
  } else {
    const jestCucumber = require('jest-cucumber');
    global.loadFeature = jestCucumber.loadFeature;
    global.defineFeature = jestCucumber.defineFeature;
  }

  files.forEach(file => {
    const feature = loadFeature(file);
    defineFeature(feature, test => {
      feature.scenarios.concat(feature.scenarioOutlines).sort((a, b) =>
        Math.sign(a.lineNumber - b.lineNumber)).forEach(scenario => {
        test(scenario.title, options => {
          const state = {};
          beforeEach(() => Object.keys(state).forEach(key => delete state[key]));
          scenario.steps.forEach(step => {
            let i;
            for (i = matchers.length - 1; i >= 0; --i) {
              if (new RegExp(matchers[i]).test(step.stepText)) {
                options[step.keyword](matchers[i], wrapper(definitions[i], state));
                break;
              }
            }
            if (i < 0) {
              options[step.keyword]('missing step', () => {});
            }
          });
        });
      });
    });
  });
};