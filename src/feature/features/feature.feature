Feature: Load feature files

  Load and define feature files using jest-cucumber

  Scenario Outline: Loading feature <feature>

    When <feature> is loaded with <steps>
    Then <definitions> are defined

    Examples: Features
      | feature                | steps                            | definitions                                                                      |
      | guess                  | starts,waits,started,joins,guess | guess{maker:when-starts,then-waits;breaker:given-started,when-joins,then-guess}  |
      | guess (missing starts) | waits,started,joins,guess        | guess{maker:when-missing,then-waits;breaker:given-started,when-joins,then-guess} |