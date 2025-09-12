import { ChallengeMode } from '../../pages/challengeMode/activityOneChallengeMode.page';
import { SummaryReport } from '../../pages/challengeMode/summaryReportActivityOne.page';
import { createBddCustom } from '../common/createBddCustom';
import { LearningMode } from '../../pages/learningMode/activityTwoLearningMode.page';
import { SummaryReportActivityTwo } from '../../pages/learningMode/summaryReportActivityTwo.page';
import { ActivityFiveChallengeMode } from '../../pages/challengeMode/activityFiveChallengeMode.page';
import { SummaryReportActivityFive } from '../../pages/challengeMode/summaryReportActivityFive.page';

const { Given, When, Then, Before } = createBddCustom();
let challengeMode: ChallengeMode;
let summaryReport: SummaryReport;
let learningMode: LearningMode;
let summaryReportActivityTwo: SummaryReportActivityTwo;
let activityFiveChallengeMode: ActivityFiveChallengeMode;
let activityFiveSummaryReport: SummaryReportActivityFive;


Before({ tags: '@dho' }, async ({ page }) => {
  challengeMode = new ChallengeMode(page);
  summaryReport = new SummaryReport(page);
  learningMode = new LearningMode(page);
  summaryReportActivityTwo = new SummaryReportActivityTwo(page);
  activityFiveChallengeMode= new ActivityFiveChallengeMode(page);
  activityFiveSummaryReport= new SummaryReportActivityFive(page);
    
});


When('the user clicks the Continue button on the step introduction popup', async function ({ }) {
  await challengeMode.clickOnContinueButton();
});

Then('the Choose an Avatar page should be displayed', async function ({ }) {
  
});


Then('the Chat section should be displayed', async function ({ }) {

});

When('the user enters a name and clicks the Done button', async function ({ }) {
  await challengeMode.typeInInputText("Emily");
  await challengeMode.clickOnAvatarSelectionDone();
});

When('the user selects the chat option for scenario {string}', async function ({ loginData, testData }, scenarioNumber: string) {
  const scenarioPath = loginData[scenarioNumber];
  await challengeMode.runScenarioPath(scenarioPath, testData);
});

Then('Verify the scenario score {string}', async function ({ loginData, testData }, scenarioNumber: string) {
  const scenarioPath = loginData[scenarioNumber];
  await summaryReport.verifyFinalScore(scenarioPath, testData);
});

When('the user selects the response option in chat section for learning mode {string}', async function ({ loginData, testData }, scenarioNumber: string) {
  const scenarioPath = loginData[scenarioNumber];
  await learningMode.runScenarioPathForLearnigMode(scenarioPath, testData);
});

Then('Verify the scenario report for activity two {string}', async function ({ loginData, testData }, scenarioNumber: string) {
  const scenarioPath = loginData[scenarioNumber];
  await summaryReportActivityTwo.verifyFinalScore(scenarioPath, testData);
});


When('the user selects the chat option for scenario in activity five for {string}', async function ({ loginData, testData }, scenarioNumber: string) {
  const scenarioPath = loginData[scenarioNumber];
  await activityFiveChallengeMode.runScenarioPath(scenarioPath, testData);
});

Then('Summary report page of activity five should be displayed', async ({}) => {
 
});

Then('Summary report content and score should be as per {string} in activity five', async function ({ loginData, testData }, scenarioNumber: string) {
  const scenarioPath = loginData[scenarioNumber];
  await activityFiveSummaryReport.verifyFinalScore(scenarioPath, testData);
});

// 1. Missing step definition for "features\activityFiveChallengeMode.feature:8:5"
Then('the Introduction popup of {string} should be visible', async ({}, arg: string) => {
  // ...
});

// 2. Missing step definition for "features\activityTwoLearningMode.feature:14:5"
When('the user clicks the Continue button on the Introduction popup of {string}', async function ({ }) {
  await challengeMode.clickOnContinueButton();
});

// 3. Missing step definition for "features\activityTwoLearningMode.feature:15:5"
Then('the avatar selection page of {string} should be displayed', async ({}, arg: string) => {
  // ...
});
