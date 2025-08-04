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
  # | S1     |
  # | S        |

  Scenario Outline: Verify all step functionalities for the golden path in Activity Three - Learning Mode "<scenario>"

    Given the user has launched Activity Three - Learning Mode on the web
    Then the Learning Objectives page of Activity Three - Learning Mode should be displayed
    And the activity title and learning objectives should match the content matrix of Activity Three - Learning Mode

    When the user clicks the Start button on the Learning Objectives page of Activity Three - Learning Mode
    Then the Introduction page of Activity Three - Learning Mode should be visible
    And the introduction text should match the content matrix of Activity Three - Learning Mode

    When the user clicks the Continue button on the Introduction page of Activity Three - Learning Mode
    Then the first step of Activity Three - Learning Mode should be displayed

    When the user selects the response option according to the "<scenario>" for Activity Three - Learning Mode
    Then the Report page of Activity Three - Learning Mode should be visible
    And the report content should match the performed "<scenario>" for Activity Three - Learning Mode

    Examples:
      | scenario |
      | S1       |
      | S2       |
      | S3       |
      | S4       |
      | S5       |
      | S6       |
      # | S7       |
      # | S8       |
      # | S9       |
      # | S10      |
      # | S11      |
      # | S12      |
      # | S13      |



