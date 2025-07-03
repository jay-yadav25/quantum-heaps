@dho
Feature: Launch Activity

  Scenario Outline: Verify chat section functionality for golden scenario <scenario>
    Given the user has launched the activity 2 on the web
    And the learning objectives screen should be displayed
    Then the activity name and learning objectives should be same as as per design
    When the user clicks the Start button on the learning objectives
    Then introduction popup shoudl be displayed
    And the introdution popup text and title should be as per design
    When the user clicks the Continue button on the introduction popup
    Then the Choose an Avatar page should be open
    When User click on option button on choose an avatar page
    Then menu popup should open having introduction and learing objective button
    And choose an avatar button should be disable on menu popup in avatar page
    When the user fill the name in input field
    Then Avatar page done button should be enable
    When User click on done button on choose an avatar page
    Then Chat section should be open
    And the step instrustion title and text should be as per design

    Examples:
    # | scenario |
    # | S        |
    # | S        |

  Scenario Outline: Verify chat section functionality for golden scenario learning mode <scenario>
    Given the user has launched the activity 2 on the web
    And the learning objectives are displayed
    When the user clicks the Start button on the learning objectives page
    Then the step introduction popup should appear
    And the first step of the activity should be displayed
    And the step introduction text should be verified
    When the user clicks the Continue button on the step introduction popup
    Then the Choose an Avatar page should be displayed
    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    When the user selects the response option in chat section for learning mode "<scenario>"

    Examples:
      # | scenario |
      # | S1       |
      # | S2       |
      # | S3       |
      # | S4       |
      # | S5       |
      # | S6       |
      # | S7       |
      # | S8       |
      # | S9       |
      # | S10      |
      # | S11      |
      # | S12      |
      # | S13      |
      # | S14      |
      # | S15      |
      # | S16      |
      # | S17      |
      # | S18      |
      # | S19      |
      # | S20      |
      # | S21      |
      # | S22      |
      # | S23      |
      # | S24      |
      # | S25      |
      # | S26      |
      # | S27      |
      # | S28      |
      # | S29      |
      # | S30      |
      # | S31      |
      # | S32      |
      # | S33      |
      # | S34      |
      # | S35      |
      # | S36      |
      # | S37      |
      # | S38      |
      # | S39      |
      # | S40      |
      # | S41      |
      # | S42      |
      # | S43      |
      # | S44      |
      # | S45      |
      # | S46      |
      # | S47      |
      # | S48      |
      # | S49      |
      # | S50      |
      # | S51      |
      # | S52      |
      # | S53      |
      # | S54      |
      # | S55      |
      # | S56      |
      # | S57      |
      # | S58      |
      # | S59      |
      # | S60      |
      # | S61      |
      # | S62      |
      # | S63      |
      # | S64      |
      # | S65      |
      # | S66      |
