import path from 'path';

import steps from '..';

export default [
  [
    /^(.*) steps were loaded before$/,
    state => previous => {
      const previousSteps = require(path.resolve(__dirname, './samples/' + previous + '.steps.js'));
      state.matchers = previousSteps.matchers;
      state.definitions = previousSteps.definitions;
    }
  ],
  [
    /^(.*) are loaded$/,
    state => stepsPath => {
      stepsPath = path.resolve(__dirname, './samples/' + stepsPath.split('(')[0].trim() + '.steps.js');
      const newSteps = steps([stepsPath], state.matchers, state.definitions);
      state.matchers = newSteps.matchers;
      state.definitions = newSteps.definitions;
    }
  ],
  [
    /^(.*) steps should be updated with (.*)$/,
    state => (previous, stepsPath) => {
      const previousSteps = require('./samples/' + previous + '.steps.js');
      const steps = require('./samples/' + stepsPath.split('(')[0].trim() + '.steps.js').default;
      expect(state.matchers).toStrictEqual([...previousSteps.matchers, ...steps.map(step => step[0])]);
      expect(state.definitions).toStrictEqual([...previousSteps.definitions, ...steps.map(step => step[1])]);
    }
  ]
];