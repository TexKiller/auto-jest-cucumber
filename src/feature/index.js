function wrapper(types, fun, state) {
  return function () {
    let args = [...arguments].slice(0, arguments.length - 1);
    args = args.map((arg, i) => types[i] === 'json' ? JSON.parse(arg) : arg);
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
              const params = step.stepText.match(new RegExp(matchers[i]));
              if (params) {
                params.shift();
                const types = params.map(param => {
                  let json;
                  try {
                    JSON.parse(param);
                    json = true;
                  } catch (e) {}
                  if (json) {
                    return 'json';
                  } else {
                    if (param.lastIndexOf('<') === 0 &&
                      param.indexOf('>') === param.length - 1) {
                      return 'example';
                    } else {
                      return 'invalid';
                    }
                  }
                });
                if (types.reduce((valid, type) => valid && type !== 'invalid', true)) {
                  options[step.keyword](matchers[i], wrapper(types, definitions[i], state));
                  break;
                }
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