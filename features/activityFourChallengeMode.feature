@dho
Feature: Launch Activity
  Scenario Outline: Verify Content of learnign objective and introduction 
    Given the user has launched the activity 4 on the web
    Then the Learning Objectives page of Activity Four - Challenge Mode should be displayed
    And the activity title and learning objectives should match the content matrix of Activity Four - Challenge Mode

    When the user clicks the Start button on the Learning Objectives page of Activity Four - Challenge Mode
    Then the Introduction page of Activity Four - Challenge Mode should be visible
    And the introduction text should match the content matrix of Activity Four - Challenge Mode

    When the user clicks the Continue button on the Introduction page of Activity Four - Challenge Mode
    Then the first step of Activity Four - Challenge Mode should be displayed

    When the user click on the Introduction button in more options menue items
    Then the Introduction popup should be visible and content should be as per content matrix

    When the user click on the Learning Objective button in more options menue items
    Then the Learning Objectives popup should be visible and content should be as per content matrix
    Examples:
  | scenario |
  # |   S1     |


  Scenario Outline: Verify all step functionalities for the golden path in Activity Four - Challenge Mode "<scenario>"

    Given the user has launched the activity 4 on the web
    Then the Learning Objectives page of Activity Four - Challenge Mode should be displayed
   
    When the user clicks the Start button on the Learning Objectives page of Activity Four - Challenge Mode
    Then the Introduction page of Activity Four - Challenge Mode should be visible
    
    When the user clicks the Continue button on the Introduction page of Activity Four - Challenge Mode
    Then the first step of Activity Four - Challenge Mode should be displayed

    When the user selects the response option according to the "<scenario>" for Activity Four - Challenge Mode
    Then the Report page of Activity Four - Challenge Mode should be visible
    And the report content should match the performed "<scenario>" for Activity Four - Challenge Mode

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
      | S11      |
      | S12      |
      | S13      |
      | S14      |
      | S15      |
      | S16      |
      | S17      |
      | S18      |
      | S19      |
      | S20      |
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
      | S52    |
      | S53      |
      | S54      |


