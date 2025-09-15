@dho
Feature: Launch Activity

  @smoke @activityFive @regression
  Scenario Outline: Verify Content of Learnign objective ,Avatar Selection ,Introduction and Chat Section of [Activity Five]
    Given the user has launched the activity <Number> on the web
    Then the Learning Objectives page of "Activity Five" should be displayed
    And the activity title and learning objectives should match the content matrix of "Activity Five"

    When the user clicks the Start button on the Learning Objectives page of "Activity Five"
    Then the Introduction popup of "Activity Five" should be visible
    And the Introduction popup content should be as per content matrix
  
    When the user clicks the Continue button on the Introduction popup of "Activity Five"
    Then the avatar selection page of "Activity Five" should be displayed
    And the avatar selection page content should be as per content matrix

    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    And the chat page content should be as per content matrix

    When the user click on the Introduction button in more options menue items
    Then the Introduction popup content should be as per content matrix
    And the user clicks the Continue button on the Introduction popup of "Activity Five"
   


    When the user click on the Learning Objective button in more options menue items
    Then the Learning Objectives popup should be visible and content should be as per content matrix
    And the user clicks the Continue button on the Learning Objective popup of "Activity Five"
    
    Examples:
    |Number|
    |  5   |

  @smoke @ActivityFive  @regression @trial
  Scenario Outline: Verify chat section functionality of activity five for golden scenario <scenario>
    Given the user has launched the activity 5 on the web
    Then the Learning Objectives page of "Activity Five" should be displayed
    When the user clicks the Start button on the Learning Objectives page of "Activity Five"
    Then the Introduction popup of "Activity Five" should be visible
    When the user clicks the Continue button on the step introduction popup
    Then the Choose an Avatar page should be displayed
    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    When the user selects the chat option for scenario in activity five for "<scenario>"
    Then Summary report page of activity five should be displayed
    And Summary report content and score should be as per "<scenario>" in activity five

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

  @regression @ActivityFive 
  Scenario Outline: Verify chat section functionality of activity five for golden scenario <scenario>
    Given the user has launched the activity 5 on the web
     Then the Learning Objectives page of "Activity Five" should be displayed
    When the user clicks the Start button on the Learning Objectives page of "Activity Five"
    Then the Introduction popup of "Activity Five" should be visible
    When the user clicks the Continue button on the step introduction popup
    Then the Choose an Avatar page should be displayed
    When the user enters a name and clicks the Done button
    Then the Chat section should be displayed
    When the user selects the chat option for scenario in activity five for "<scenario>"
    Then Summary report page of activity five should be displayed
    And Summary report content and score should be as per "<scenario>" in activity five

    Examples:
      | scenario |
      | R1       |
      | R2       |
      | R3       |
      | R4       |
      | R5       |
      | R6       |
      | R7       |
      | R8       |
      | R9       |
      | R10      |
      | R11      |
      | R12      |
      | R13      |
      | R14      |
      | R15      |
      | R16      |
      | R17      |
      | R18      |
      | R19      |
      | R20      |
      | R21      |
      | R22      |
      | R23      |
      | R24      |
      | R25      |
      | R26      |
      | R27      |
      | R28      |
      | R29      |
      | R30      |
      | R31      |
      | R33      |
      | R34      |
      | R35      |
      | R36      |
      | R37      |
      | R38      |
      | R39      |
      | R40      |
      | R41      |
      | R42      |
      | R43      |
      | R44      |
      | R45      |
      | R46      |
      | R47      |
      | R48      |
      | R49      |
      | R50      |
      | R51      |
      | R52      |
      | R53      |
      | R54      |
      | R55      |
      | R56      |
      | R57      |
      | R58      |
      | R59      |
      | R60      |
      | R61      |
      | R62      |
      | R63      |
      | R64      |
      | R65      |
      | R66      |
      | R67      |
      | R68      |
      | R69      |
      | R70      |
      | R71      |
      | R72      |
      | R73      |
      | R74      |
      | R75      |
      | R76      |
      | R77      |
      | R78      |
      | R79      |
      | R80      |
      | R81      |
      | R82      |
      | R83      |
      | R84      |
      | R85      |
      | R86      |
      | R87      |
      | R88      |
      | R89      |
      | R90      |
      | R91      |
      | R92      |
      | R93      |
      | R94       |
      | R95       |
      | R96       |
      | R97       |
      | R98       |
      | R99       |
      | R100      |
      | R101      |
      | R102      |
      | R103      |
      | R104      |
      | R105      |
      | R106      |
      | R107      |
      | R108      |
      | R109      |
      | R110      |
      | R111      |
      | R112      |
      | R113      |
      | R114      |
      | R115      |
      | R116      |
      | R117      |
      | R118      |
      | R119      |
      | R120      |
      | R121      |
      | R122      |
      | R123      |
      | R124      |
      | R125      |
      | R126      |
      | R127      |
      | R128      |
      | R129      |
      | R130      |
      | R131      |
      | R133      |
      | R134      |
      | R135      |
      | R136      |
      | R137      |
      | R138      |
      | R139      |
      | R140      |
      | R141      |
      | R142      |
      | R143      |
      | R144      |
      | R145      |
      | R146      |
      | R147      |
      | R148      |
      | R149      |
      | R150 |
      | R151 |
      | R152 |
      | R153 |
      | R154 |
      | R155 |
      | R156 |
      | R157 |
      | R158 |
      | R159 |
      | R160 |
      | R161 |
      | R162 |
      | R163 |
      | R164 |
      | R165 |
      | R166 |
      | R167 |
      | R168 |
      | R169 |
      | R170 |
      | R171 |
      | R172 |
      | R173 |
      | R174 |
      | R175 |
      | R176 |
      | R177 |
      | R178 |
      | R179 |
      | R180 |
      | R181 |
      | R182 |
      | R183 |
      | R184 |
      | R185 |
      | R186 |
      | R187 |
      | R188 |
      | R189 |
      | R190 |
      | R191 |
      | R192 |
      | R193 |
      | R194 |
      | R195 |
      | R196 |
      | R197 |
      | R198 |
      | R199 |
      | R200 |
      | R201 |
      | R202 |
      | R203 |
      | R204 |
      | R205 |
      | R206 |
      | R207 |
      | R208 |
      | R209 |
      | R210 |
      | R211 |
      | R212 |
      | R213 |
      | R214 |
      | R215 |
      | R216 |
      | R217 |
      | R218 |
      | R219 |


