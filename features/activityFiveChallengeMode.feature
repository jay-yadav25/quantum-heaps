@dho
Feature: Launch Activity

  Scenario Outline: Verify chat section functionality of activity five for golden scenario <scenario>
    Given the user has launched the activity five on the web
    And the learning objectives of activity five are displayed
    When the user clicks the Start button on the learning objectives page of activity five
    Then the step introduction popup of activity five should be appear
    And the first step of the activity five should be displayed
    And the step introduction text of activity five  should be same as content matrix
    When the user clicks the Continue button on the step introduction popup of activity five
    Then the Choose an Avatar page of activity five should be displayed
    When the user enters a name and clicks the Done button on activity five 
    Then the Chat section of activity five should be displayed
    When the user selects the chat option for scenario in activity five for "<scenario>"
    Then Summary report page of activity five should be displayed
    And Summary report content and score should be as per "<scenario>" in activity five

    Examples:
      | scenario |
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
