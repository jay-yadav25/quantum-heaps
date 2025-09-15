@dho
Feature: Launch Activity
  @smoke @ActivityOne @regression 
  Scenario Outline: Verify chat section functionality for golden scenario <scenario>
    Given the user has launched the activity 1 on the web
    Then the Learning Objectives page of "Activity One" should be displayed
    When the user clicks the Start button on the Learning Objectives page of "Activity One"
    Then the Introduction popup of "Activity One" should be visible
    When the user clicks the Continue button on the step introduction popup
    Then the Choose an Avatar page should be displayed
    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    When the user selects the chat option for scenario "<scenario>"
    Then Verify the scenario score "<scenario>"

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
      
  @regression @ActivityOne
  Scenario Outline: Verify chat section functionality for scenario <scenario>
    Given the user has launched the activity 1 on the web
    Then the Learning Objectives page of "Activity One" should be displayed
    When the user clicks the Start button on the Learning Objectives page of "Activity One"
    Then the Introduction popup of "Activity One" should be visible
    When the user clicks the Continue button on the step introduction popup
    Then the Choose an Avatar page should be displayed
    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    When the user selects the chat option for scenario "<scenario>"
    Then Verify the scenario score "<scenario>"

    Examples:
      | scenario |
      | 1 |
      | 2 |
      | 3 |
      | 4 |
      | 5 |
      | 6 |
      | 7 |
      | 8 |
      | 9 |
      | 10 |
      | 11 |
      | 12 |
      | 13 |
      | 14 |
      | 15 |
      | 16 |
      | 17 |
      | 18 |
      | 19 |
      | 20 |
      | 21 |
      | 22 |
      | 23 |
      | 24 |
      | 25 |
      | 26 |
      | 27 |
      | 28 |
      | 29 |
      | 30 |
      | 31 |
      | 32 |
      | 33 |
      | 34 |
      | 35 |
      | 36 |
      | 37 |
      | 38 |
      | 39 |
      | 40 |
      | 41 |
      | 42 |
      | 43 |
      | 44 |
      | 45 |
      | 46 |
      | 47 |
      | 48 |
      | 49 |
      | 50 |
      | 51 |
      | 52 |
      | 53 |
      | 54 |
      | 55 |
      | 56 |
      | 57 |
      | 58 |
      | 59 |
      | 60 |
      | 61 |
      | 62 |
      | 63 |
      | 64 |
      | 65 |
      | 66 |
      | 67 |
      | 68 |
      | 69 |
      | 70 |
      | 71 |
      | 72 |
      | 73 |
      | 74 |
      | 75 |
      | 76 |
      | 77 |
      | 78 |
      | 79 |
      | 80 |
      | 81 |
      | 82 |
      | 83 |
      | 84 |
      | 85 |
      | 86 |
      | 87 |
      | 88 |
      | 89 |
      | 90 |
      | 91 |
      | 92 |
      | 93 |
      | 94 |
      | 95 |
      | 96 |
      | 97 |
      | 98 |
      | 99 |
      | 100 |
      | 101 |
      | 102 |
      | 103 |
      | 104 |
      | 105 |
      | 106 |
      | 107 |
      | 108 |
      | 109 |
      | 110 |
      | 111 |
      | 112 |
      | 113 |
      | 114 |
      | 115 |
      | 116 |
      | 117 |
      | 118 |
      | 119 |
      | 120 |
      | 121 |
      | 122 |
      | 123 |
      | 124 |
      | 125 |
      | 126 |
      | 127 |
      | 128 |
      | 129 |
      | 130 |
      | 131 |
      | 132 |
      | 133 |
      | 134 |
      | 135 |
      | 136 |
      | 137 |
      | 138 |
      | 139 |
      | 140 |
      | 141 |
      | 142 |
      | 143 |
      | 144 |
      | 145 |
      | 146 |
      | 147 |
      | 148 |
      | 149 |
      | 150 |
     