import { ChallengeMode } from '../../pages/challengeMode/challengeMode.page';
import { SummaryReport } from '../../pages/commonPages/summaryReport.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();
let challengeMode: ChallengeMode;
let summaryReport: SummaryReport;


Before({ tags: '@dho' }, async ({ page }) => {
  challengeMode = new ChallengeMode(page);
  summaryReport= new SummaryReport(page);

});

Given('the user has launched the activity on the web', async function ({ }) {
  await challengeMode.launchActivity();
});

Given('the learning objectives are displayed', async function ({ }) {
  // await challengeMode.
});

When('the user clicks the Start button on the learning objectives page', async function ({ }) {
  await challengeMode.clickOnStartButton();
});

Then('the step introduction popup should appear', async function ({ }) {

});

Then('the first step of the activity should be displayed', async function ({ }) {

});

Then('the step introduction text should be verified', async function ({ }) {
});

When('the user clicks the Continue button on the step introduction popup', async function ({ }) {

});

Then('the Choose an Avatar page should be displayed', async function ({ }) {
  // ...
});

When('the user enters a name and clicks the Done button', async function ({ }) {
  await challengeMode.typeInInputText("jay");
  await challengeMode.clickOnAvatarSelectionDone();
});

Then('the Chat section should be displayed', async function ({ }) {

});

When('the user selects the chat option for scenario {int}', async function ({ loginData, testData }, scenarioNumber: number) {
  const scenarioPath = loginData[String(scenarioNumber)];
  await challengeMode.runScenarioPath(scenarioPath, testData);
});

Then('Verify the scenario score {int}', async function ({ loginData, testData }, scenarioNumber: number) {
  const scenarioPath = loginData[String(scenarioNumber)];
  await summaryReport.verifyFinalScore(scenarioPath, testData);
});