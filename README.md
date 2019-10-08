# Auto Jest Cucumber

Library for automatic setup of [jest-cucumber](https://github.com/bencompton/jest-cucumber) tests based on .feature files and JavaScript step definitions.

## Overview

Auto Jest Cucumber utilizes [jest-cucumber](https://github.com/bencompton/jest-cucumber) to link step definitions to .feature files, making it easy to reutilize step definitions and facilitating the state management for each Scenario/Scenario Outline.

## Motivation

Even though [jest-cucumber](https://github.com/bencompton/jest-cucumber) is very useful for linking tests running on [Jest](https://jestjs.io/) to [Cucumber](https://cucumber.io/) .feature files, the steps definition in pure [jest-cucumber](https://github.com/bencompton/jest-cucumber) can be a little awkward. You have to basically remake the .feature file in JavaScript, defining every Scenario with all its steps. This is sub-optimal, as this information is already available in the .feature file and it gets hard to reuse steps in different Scenarios and .feature files. One workaround for that is to store the step definitions somewhere and import them when we configure [jest-cucumber](https://github.com/bencompton/jest-cucumber), but then this configuration would be a (completely pointless) second .feature file written in JavaScript. Auto Jest Cucumber can do this configuration automatically, parsing the .feature file, importing steps automatically from the steps definitions (in a similar manner to how [Cucumber](https://cucumber.io/) does it) and setting up the tests on [Jest](https://jestjs.io/) using [jest-cucumber](https://github.com/bencompton/jest-cucumber).

## Getting Started

The following steps show how to setup a basic feature test using Auto Jest Cucumber with the default options.

It is possible to customize this behaviour, however that is not addressed here and is undocumented for now.

### Install Auto Jest Cucumber:

```
npm install auto-jest-cucumber --save-dev
```

### Add the following to your Jest configuration:

```javascript  
  "testPathIgnorePatterns": [
    "<rootDir>(.*)/node_modules/(?!auto-jest-cucumber).*"
  ],
  "moduleFileExtensions": [
    "js",
    "feature"
  ],
  "haste": {
    "providesModuleNodeModules": ["auto-jest-cucumber"]
  }
```

### Add a feature file inside the `features` folder:

```gherkin
# features/rocket-launching.feature

Feature: Rocket Launching

Scenario: Launching a SpaceX rocket
  Given I am Elon Musk attempting to launch a rocket into space
  When I launch the rocket
  Then the rocket should end up in space
  And the booster(s) should land back on the launch pad
  And nobody should doubt me ever again
```

### Add a steps definition file inside the `features` folder:
```javascript
// features/rocket-launching.steps.js

export default [
  [
    'I am Elon Musk attempting to launch a rocket into space',
    state => () => {
      state.rocket = new Rocket();
    })
  ],
  [
    'I launch the rocket',
    state => () => {
      rocket.launch();
    })
  ],
  [
    'the rocket should end up in space',
    state => () => {
      expect(state.rocket.isInSpace).toBe(true);
    })
  ],
  [
    'the booster(s) should land back on the launch pad',
    state => () => {
      expect(state.rocket.boostersLanded).toBe(true);
    })
  ],
  [
    'nobody should doubt me ever again',
    state => () => {
      expect('people').not.toBe('haters');
    })
  ]
];
```