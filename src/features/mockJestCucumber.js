import {
  loadFeature
} from 'jest-cucumber';

const mockLoad = state => (featureFilePath, options) => {
  state.features = state.features || {};
  state.features[featureFilePath] = {
    options
  };
  const feature = loadFeature(featureFilePath, options);
  feature.name = featureFilePath.replace(/\\/g, '/').split('/').pop().replace('.feature', '');
  state.definitions = state.definitions || [];
  state.definitions.push({
    feature: feature.name,
    scenarios: []
  });
  return feature;
};

const mockStep = (state, steps) => stepType => matcher => {
  state.push(stepType + '-' + (matcher === 'missing step' ? 'missing' :
    Object.keys(steps).filter(step => new RegExp(matcher).test(steps[step]))[0]));
};

const mockSteps = (state, items) => {
  const step = mockStep(state, items.steps);
  return {
    defineStep: step('step'),
    given: step('given'),
    when: step('when'),
    then: step('then'),
    and: step('and'),
    but: step('but'),
    pending: () => {}
  };
};

const mockTest = (state, feature, items) => (scenarioTitle, scenarioDefinition) => {
  state.definitions = state.definitions || [];
  const features = state.definitions.filter(featureDefinition => feature === featureDefinition.feature);
  features[features.length - 1].scenarios.push({
    scenario: Object.keys(items.scenarios).filter(scenario => new RegExp(scenarioTitle).test(items.scenarios[scenario]))[0],
    steps: []
  });
  const stepsState = features[features.length - 1].scenarios[features[features.length - 1].scenarios.length - 1].steps;
  scenarioDefinition(mockSteps(stepsState, items));
};

const mockDefine = (state, items) => (featureFromFile, scenariosDefinitionCallback) =>
  scenariosDefinitionCallback(mockTest(state, featureFromFile.name, items));

export default (state, items) => {
  global.mockedJestCucumber = {
    loadFeature: mockLoad(state),
    defineFeature: mockDefine(state, items)
  };
};