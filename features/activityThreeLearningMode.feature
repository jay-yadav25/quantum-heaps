@dho
Feature: Launch Activity
  @smoke @ActivityThree @regression
  Scenario Outline: Verify Content of learning objective and introduction of [Activity Three]
    Given the user has launched the activity <Number> on the web
    Then the Learning Objectives page of "Activity Three" should be displayed
    And the activity title and learning objectives should match the content matrix of "Activity Three"

    When the user clicks the Start button on the Learning Objectives page of "Activity Three"
    Then the Introduction page of "Activity Three" should be visible
    And the introduction text should match the content matrix of "Activity Three"

    When the user clicks the Continue button on the Introduction page of "Activity Three"
    Then the first step of "Activity Three" should be displayed
     
    When the user click on the Introduction button in more options menu items
    Then the Introduction popup content should be as per content matrix
    And the user clicks the Continue button on the Introduction popup of "<Activity Number>"

    When the user click on the Learning Objective button in more options menu items
    Then the Learning Objectives popup should be visible and content should be as per content matrix
    And the user clicks the Continue button on the Learning Objective popup of "<Activity Number>"
    
    Examples:
   |Number|
   |  3   |
  
  @smoke  @ActivityThree @regression
  Scenario Outline: Verify all step functionalities for the golden path in Activity Three - Learning Mode "<scenario>"
    Given the user has launched the activity 3 on the web
    Then the Learning Objectives page of "Activity Three" should be displayed

    When the user clicks the Start button on the Learning Objectives page of "Activity Three"
    Then the Introduction page of "Activity Three" should be visible
    
    When the user clicks the Continue button on the Introduction page of "Activity Three"
    Then the first step of "Activity Three" should be displayed
    
    When the user selects the response option according to the "<scenario>" for Activity Three - Learning Mode
    Then the Report page of Activity Three - Learning Mode should be visible
    And the report content should match the performed "<scenario>" for Activity Three - Learning Mode

    Examples:
      | scenario |
      # | S1       |
      # | S2       |
      # | S3       |
      # | S4       |
      # | S5       |
      # | S6       |
      # | S13      |
      # | S14      |
      # | S15      |
      # | S16      |
      # | S17      |
      # | S18      |


  @ActivityThree @regression
  Scenario Outline: Verify all step functionalities for the golden path in Activity Three - Learning Mode "<scenario>"
    Given the user has launched the activity 3 on the web
    Then the Learning Objectives page of "Activity Three" should be displayed

    When the user clicks the Start button on the Learning Objectives page of "Activity Three"
    Then the Introduction page of "Activity Three" should be visible
    
    When the user clicks the Continue button on the Introduction page of "Activity Three"
    Then the first step of "Activity Three" should be displayed
    
    When the user selects the response option according to the "<scenario>" for Activity Three - Learning Mode
    Then the Report page of Activity Three - Learning Mode should be visible
    And the report content should match the performed "<scenario>" for Activity Three - Learning Mode

    Examples:
      | scenario |
      # | S7       |
      # | S8       |
      # | S9       |
      # | S10      |
      # | S11      |
      | S12      |
      # | S19      |
      # | S20      |
      # | S21      |
      # | S22      |
      # | S23      |
      | S24      |
     
     



