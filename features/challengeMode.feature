@dho
Feature: Launch Activity

  Scenario Outline: Verify chat section functionality for golden scenario <scenario>
    Given the user has launched the activity on the web
    And the learning objectives are displayed
    When the user clicks the Start button on the learning objectives page
    Then the step introduction popup should appear
    And the first step of the activity should be displayed
    And the step introduction text should be verified
    When the user clicks the Continue button on the step introduction popup
    Then the Choose an Avatar page should be displayed
    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    When the user selects the chat option for scenario <scenario>
    Then Verify the scenario score <scenario>

    Examples:
  # | scenario |
  # # |    1     |

  Scenario Outline: Verify chat section functionality for scenario <scenario>
    Given the user has launched the activity on the web
    And the learning objectives are displayed
    When the user clicks the Start button on the learning objectives page
    Then the step introduction popup should appear
    And the first step of the activity should be displayed
    And the step introduction text should be verified
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
  # |    1     |
  # |    2     |
  # |    3     |
  # |    4     |
  # |    5     |
  # |    6     |
  # |    7     |
  # |    8     |
  # |    9     |
  # |   10     |
  # |   11     |
  # |   12     |
  # |   13     |
  # |   14     |
  # |   15     |
  # |   16     |
  # |   17     |
  # |   18     |
  # |   19     |
  # |   20     |
  # |   21     |
  # |   22     |
  # |   23     |
  # |   24     |
  # |   25     |
  # |   26     |
  # |   27     |
  # |   28     |
  # |   29     |
  # |   30     |
  # |   31     |
  # |   32     |
  # |   33     |
  # |   34     |
  # |   35     |
  # |   36     |
  # |   37     |
  # |   38     |
  # |   39     |
  # |   40     |
  # |   41     |
  # |   42     |
  # |   43     |
  # |   44     |
  # |   45     |
  # |   46     |
  # |   47     |
  # |   48     |
  # |   49     |
  # |   50     |
  # |   51     |
  # |   52     |
  # |   53     |
  # |   54     |
  # |   55     |
  # |   56     |
  # |   57     |
  # |   58     |
  # |   59     |
  # |   60     |
  # |   61     |
  # |   62     |
  # |   63     |
  # |   64     |
  # |   65     |
  # |   66     |
  # |   67     |
  # |   68     |
  # |   69     |
  # |   70     |
  # |   71     |
  # |   72     |
  # |   73     |
  # |   74     |
  # |   75     |
  # |   76     |
  # |   77     |
  # |   78     |
  # |   79     |
  # |   80     |
  # |   81     |
  # |   82     |
  # |   83     |
  # |   84     |
  # |   85     |
  # |   86     |
  # |   87     |
  # |   88     |
  # |   89     |
  # |   90     |
  # |   91     |
  # |   92     |
  # |   93     |
  # |   94     |
  # |   95     |
  # |   96     |
  # |   97     |
  # |   98     |
  # |   99     |
  # |  100     |
