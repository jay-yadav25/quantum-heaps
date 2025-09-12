@dho
Feature: Launch Activity

  @smoke @activityTwoSmoke @regression
  Scenario Outline: Verify Content of Learnign objective ,Avatar Selection ,Introduction and Chat Section of [<Activity Number>]
    Given the user has launched the activity <Number> on the web
    Then the Learning Objectives page of "Activity Two" should be displayed
    And the activity title and learning objectives should match the content matrix of "Activity Two"

    When the user clicks the Start button on the Learning Objectives page of "Activity Two"
    Then the Introduction popup of "Activity Two" should be visible
    And the Introduction popup content should be as per content matrix
  
    When the user clicks the Continue button on the Introduction popup of "Activity Two"
    Then the avatar selection page of "<Activity Two" should be displayed
    And the avatar selection page content should be as per content matrix

    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    And the chat page content should be as per content matrix

    When the user click on the Introduction button in more options menue items
    Then the Introduction popup content should be as per content matrix
    And the user clicks the Continue button on the Introduction popup of "<Activity Number>"
   


    When the user click on the Learning Objective button in more options menue items
    Then the Learning Objectives popup should be visible and content should be as per content matrix
    And the user clicks the Continue button on the Learning Objective popup of "<Activity Number>"
    
    Examples:
    |Number|
    |  2   |

 
    @smoke @ActivityTwoSmoke @regression @trial
    Scenario Outline: Verify chat section functionality for golden scenario learning mode <scenario>
    Given the user has launched the activity 2 on the web
    Then the Learning Objectives page of "Activity Two" should be displayed
    When the user clicks the Start button on the Learning Objectives page of "Activity Two"
    Then the Introduction popup of "Activity Two" should be visible
    When the user clicks the Continue button on the step introduction popup
    Then the Choose an Avatar page should be displayed
    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed 
    When the user selects the response option in chat section for learning mode "<scenario>"
    Then Verify the scenario report for activity two "<scenario>"

    Examples:
    | scenario |
    | S1       |
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

  @regression
  Scenario Outline: Verify chat section functionality for golden scenario learning mode <scenario>
    Given the user has launched the activity 2 on the web
    Then the Learning Objectives page of "Activity Two" should be displayed
    When the user clicks the Start button on the Learning Objectives page of "Activity Two"
    Then the Introduction popup of "Activity Two" should be visible
    When the user clicks the Continue button on the step introduction popup
    Then the Choose an Avatar page should be displayed
    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    When the user selects the response option in chat section for learning mode "<scenario>"
    Then Verify the scenario report for activity two "<scenario>"

    Examples:
    | scenario |
    | S21      |
    | S22      |
    | S23      |
    | S24      |
    | S25      |
    | S26      |
    | S27      |
    | S28      |
    | S29      |
    | S30      |
    | S31      |
    | S32      |
    | S33      |
    | S34      |
    | S35      |
    | S36      |
    | S37      |
    | S38      |
    | S39      |
    | S40      |
    | S41      |
    | S42      |
    | S43      |
    | S44      |
    | S45      |
    | S46      |
    | S47      |
    | S48      |
    | S49      |
    | S50      |
    | S51      |
    | S52      |
    | S53      |
    | S54      |
    | S55      |
    | S56      |
    | S57      |
    | S58      |
    | S59      |
    | S60      |
    | S61      |
    | S62      |
    | S63      |
    | S64      |
    | S65      |
    | S66      |
