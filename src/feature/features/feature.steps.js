import path from 'path';

import feature from '..';
import mockJestCucumber from '../../features/mockJestCucumber';

export default [
  [
    /^(.*) is loaded with (.*)$/,
    state => (featurePath, steps) => {
      featurePath = path.resolve(__dirname, './samples/' + featurePath.split('(')[0].trim() + '.feature');
      steps = steps.split(',');
      const items = require(featurePath + '.js').default;

      mockJestCucumber(state, items);
      feature([featurePath], Object.keys(items.steps)
        .filter(step => steps.indexOf(step) !== -1)
        .map(step => items.steps[step]), Array(steps.length).fill(() => {}));
    }
  ]
];