Feature: Load steps files

  Load steps from a JavaScript file in a format that can be used by the feature function

  Scenario Outline: Loading steps from <steps>

    Given <previous> steps were loaded before
    When <steps> are loaded
    Then <previous> steps should be updated with <steps>

    Examples: Steps
      | previous | steps                       |
      | no       | guess                       |
      | previous | guess (with previous steps) |