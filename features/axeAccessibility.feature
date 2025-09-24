@dho
Feature: Axe Accessibility Scan All Activity

  @accessibility @regression
  Scenario Outline: Run axe Accessibility Automation on all page of [<Activity Number>]
    Given the user has launched the activity <Number> on the web
    Then the Learning Objectives page of "<Activity Number>" should be displayed
    And perform accessibility scan for "<Activity Number>-LearningObjectivePage"
    
    When the user clicks the Start button on the Learning Objectives page of "<Activity Number>"
    Then the Introduction popup of "<Activity Number>" should be visible
    And perform accessibility scan for "<Activity Number>-IntroductionPopup"

    When the user clicks the Continue button on the Introduction popup of "<Activity Number>"
    Then the avatar selection page of "<Activity Number>" should be displayed
    And perform accessibility scan for "<Activity Number>-AvatarSelectionPage"
    
    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    And perform accessibility scan for "<Activity Number>-ConversationPage"
    
    When the user click on the Introduction button in more options menu items
    Then perform accessibility scan for "<Activity Number>-IntroductionPopupMoreOptions"
    And the user clicks the Continue button on the Introduction popup of "<Activity Number>"
   

    When the user click on the Learning Objective button in more options menu items
    Then perform accessibility scan for "<Activity Number>-LearningObjectivePopup"
    And the user clicks the Continue button on the Learning Objective popup of "<Activity Number>"
    Examples:
   |Activity Number |Number|
   |ActivityOne     |  1   |
   |ActivityTwo     |  2   |
   |ActivityFive    |  5   |



   @accessibility @regression
  Scenario Outline: Run axe Accessibility Automation on all page of [<Activity Number>]
    Given the user has launched the activity <Number> on the web
    Then the Learning Objectives page of "<Activity Number>" should be displayed
    And perform accessibility scan for "<Activity Number>-LearningObjectivePage"
    
    When the user clicks the Start button on the Learning Objectives page of "<Activity Number>"
    Then the Introduction page of "Activity Four" should be visible
    And perform accessibility scan for "<Activity Number>-IntroductionPage"

    When the user clicks the Continue button on the Introduction page of "Activity Four"
    Then the first step of "Activity Four" should be displayed
    And perform accessibility scan for "<Activity Number>-FirstStep"
    
    When the user click on the Introduction button in more options menu items
    Then perform accessibility scan for "<Activity Number>-IntroductionPopupMoreOptions"
    And the user clicks the Continue button on the Introduction popup of "<Activity Number>"
   

    When the user click on the Learning Objective button in more options menu items
    Then perform accessibility scan for "<Activity Number>-LearningObjectivePopup"
    And the user clicks the Continue button on the Learning Objective popup of "<Activity Number>"
    Examples:
   |Activity Number |Number|
   |ActivityThree   |  3   |
   |ActivityFour    |  4   |
   | ActivitySix    |  6   |



