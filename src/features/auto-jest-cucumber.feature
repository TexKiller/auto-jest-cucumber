Feature: Test based on .feature files and JavaScript step definitions

  Automatic jest-cucumber tests based on .feature files and JavaScript step definitions

  Scenario Outline: Setup tests on <folder>

    When auto-jest-cucumber is loaded on <folder>
    Then <definitions> are defined

    Examples: Features
      | folder | definitions                                                                     |
      | guess  | guess{maker:when-starts,then-waits;breaker:given-started,when-joins,then-guess} |