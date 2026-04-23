Feature: Axe Accessibility Scan All Activity
  @accessibility @regression
  Scenario Outline: Run axe Accessibility Automation on all page of [<Activity Number>]
    Given the user has launched the activity <Number> on the web
    Then the Learning Objectives page of "<Activity Number>" should be displayed
    And perform accessibility scan for "<Activity Number>-LearningObjectivePage"
    
    Examples:
   |Activity Number |Number|
   |ActivityThree   |  3   |
   |ActivityFour    |  4   |
   | ActivitySix    |  6   |



