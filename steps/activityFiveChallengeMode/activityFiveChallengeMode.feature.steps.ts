import { ActivityFiveChallengeMode } from '../../pages/activityFiveChallengeMode/activityFiveChallengeMode.page';
import { ActivityFiveLearningObjectivePage } from '../../pages/activityFiveChallengeMode/activityFiveLearningObjective.page';
import { SummaryReportActivityFive } from '../../pages/commonPages/activityFiveSummaryReport.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();
let activityFiveChallengeMode: ActivityFiveChallengeMode;
let activityFiveSummaryReport: SummaryReportActivityFive;
let activityFiveLearningObjective: ActivityFiveLearningObjectivePage;

Before({ tags: '@dho' }, async ({ page }) => {
  activityFiveChallengeMode= new ActivityFiveChallengeMode(page);
  activityFiveSummaryReport= new SummaryReportActivityFive(page);
  activityFiveLearningObjective = new ActivityFiveLearningObjectivePage(page);

});


Given('the learning objectives of activity five are displayed', async function ({ }) {
  // await challengeMode.
});

When('the user clicks the Start button on the learning objectives page of activity five', async function ({ }) {
  await activityFiveChallengeMode.clickOnStartButton();
});

Then('the step introduction popup of activity five should be appear', async function ({ }) {
  
});

Then('the first step of the activity five should be displayed', async function ({ }) {
  
});

Then('the step introduction text of activity five  should be same as content matrix', async function ({ }) {

});

When('the user clicks the Continue button on the step introduction popup of activity five', async function ({ }) {
  
});

Then('the Choose an Avatar page of activity five should be displayed', async function ({ }) {
  
});


When('the user enters a name and clicks the Done button on activity five', async function ({ }) {
   await activityFiveChallengeMode.typeInInputText("Emily");
  await activityFiveChallengeMode.clickOnAvatarSelectionDone();
});

Then('the Chat section of activity five should be displayed', async function ({ }) {
  
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
