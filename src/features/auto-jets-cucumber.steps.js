import autoJestCucumber from '../../dist/auto-jest-cucumber';
import mockJestCucumber from './mockJestCucumber';

export default [
  [
    /^auto-jest-cucumber is loaded on (.*)$/,
    state => folder => {
      const folderPath = './samples/' + folder;
      const items = require(folderPath + '/' + folder + '.feature.js').default;
      mockJestCucumber(state, items);
      autoJestCucumber({
        root: './samples/' + folder,
        stepsSubdir: ''
      });
    }
  ],
  [
    /^(.*) are defined$/,
    state => definitions => {
      expect(state.definitions).toStrictEqual(definitions.split('}')
        .filter(featureDefinition => featureDefinition.length > 0)
        .map(featureDefinition => {
          const feature = featureDefinition.split('{');
          return {
            feature: feature[0],
            scenarios: feature[1].split(';').map(scenarioDefinition => {
              const scenario = scenarioDefinition.split(':');
              return {
                scenario: scenario[0],
                steps: scenario[1].split(',')
              };
            })
          };
        }));
    }
  ]
];