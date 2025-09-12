 @dho
Feature: Launch Activity

  @smoke @activityThreeSmoke @regression
  Scenario Outline: Verify Content of learnign objective and introduction of [Activity Six]
    Given the user has launched the activity <Number> on the web
    Then the Learning Objectives page of "Activity Six" should be displayed
   # And perfome accessibility scan for "Activity Six"
    And the activity title and learning objectives should match the content matrix of "Activity Six"

    When the user clicks the Start button on the Learning Objectives page of "Activity Six"
    Then the Introduction page of "Activity Six" should be visible
     #And perfome accessibility scan for "Activity Six-IntroPage"
    And the introduction text should match the content matrix of "Activity Six"

    When the user clicks the Continue button on the Introduction page of "Activity Six"
    Then the first step of "Activity Six" should be displayed
     #And perfome accessibility scan for "Activity Six-Step One"

    When the user click on the Introduction button in more options menue items
     #And perfome accessibility scan for "Activity Six-IntroPopup"
    Then the Introduction popup content should be as per content matrix
    And the user clicks the Continue button on the Introduction popup of "<Activity Number>"

    When the user click on the Learning Objective button in more options menue items
     #And perfome accessibility scan for "Activity Six-LoPopup"
    Then the Learning Objectives popup should be visible and content should be as per content matrix
    And the user clicks the Continue button on the Learning Objective popup of "<Activity Number>"
    
    Examples:
    |Number|
    |  6   |

  @smoke @ActivitySixSmoke @regression
  Scenario Outline: Verify all step functionalities for the golden path in Activity Six - Learning Mode "<scenario>"

    Given the user has launched the activity 6 on the web
    Then the Learning Objectives page of "Activity Six" should be displayed

    When the user clicks the Start button on the Learning Objectives page of "Activity Six"
    Then the Introduction page of "Activity Three" should be visible
    
    When the user clicks the Continue button on the Introduction page of "Activity Six"
    Then the first step of "Activity Three" should be displayed
    
    When the user selects the response option according to the "<scenario>" for Activity Six - Learning Mode
    Then the Report page of Activity Six - Learning Mode should be visible
    And the report content should match the performed "<scenario>" for Activity Six - Learning Mode

    Examples:
      | scenario |
      | S1       |
      | S2       |
      | S3       |
      | S4       |
      | S5       |
      | S6       |
      | S7       |
      | S8       |
      | S9       |
      | S10      |

  @regression
  Scenario Outline: Verify all step functionalities for the golden path in Activity Six - Learning Mode "<scenario>"

    Given the user has launched the activity 6 on the web
    Then the Learning Objectives page of "Activity Six" should be displayed

    When the user clicks the Start button on the Learning Objectives page of "Activity Six"
    Then the Introduction page of "Activity Three" should be visible
    
    When the user clicks the Continue button on the Introduction page of "Activity Six"
    Then the first step of "Activity Three" should be displayed
    
    When the user selects the response option according to the "<scenario>" for Activity Six - Learning Mode
    Then the Report page of Activity Six - Learning Mode should be visible
    And the report content should match the performed "<scenario>" for Activity Six - Learning Mode

    Examples:
      | scenario |
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
    

