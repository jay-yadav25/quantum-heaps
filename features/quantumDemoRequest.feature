Feature: Quantum Heaps Demo Request
  @smoke @regression
  Scenario Outline: Successfully submit a custom demo request for "<userType>"
    Given User navigates to the Quantum Heaps home page
    When User clicks the Get Started button
    And User closes the dialog popup
    And User clicks the Start Free No Card Needed link
    And User fills in the demo request form for "<userType>"
    And User clicks the Request Your Custom Demo button
    And User accepts the data collection agreement
    And User submits the demo request form
    Then the demo request should be submitted successfully for "<userType>"

    Examples:
      | userType            |
      | Individual User     |
      | Enterprise Client   |
      | Startup Team        |
      | Educational User    |
      | Corporate Account   |
