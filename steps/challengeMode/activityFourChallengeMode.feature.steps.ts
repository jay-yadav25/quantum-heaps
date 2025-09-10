

import env from '../../fixtures/env';
import { ActivityFour } from '../../pages/activityFourChallengeMode/activityFourChallengeMode.page';
import { SummaryReportActivityFour } from '../../pages/commonPages/summaryReportActivityFour.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();
let activityFour : ActivityFour ;
let summaryReportActivityFour : SummaryReportActivityFour ;

Before({ tags: '@dho' }, async ({ page }) => {
  activityFour  = new ActivityFour (page);
  summaryReportActivityFour =new SummaryReportActivityFour (page);
});

// Before({ tags: '@dho' }, async ({ page }, testInfo) => {
//   // Set testInfo once here - it will be available in all page methods
//   activityFour = new ActivityFour(page, testInfo);
//   summaryReportActivityFour = new SummaryReportActivityFour(page, testInfo);
// });
Given('the user has launched the activity {int} on the web', async function ({}, activityNumber: number)  {
  const environment = env["ENVIRONMENT"] || "STAGE";
  await activityFour .launchActivity(environment,activityNumber);
});

Then('the Learning Objectives page of Activity Four - Challenge Mode should be displayed',async function ({ testData }) {
  await activityFour .verifyLearningObjectivePageIsVisible();
});

When('the user clicks the Start button on the Learning Objectives page of Activity Four - Challenge Mode', async function ({ testData }) {
  await activityFour .clickOnStartButton();
});


Then('the Introduction page of Activity Four - Challenge Mode should be visible', async function ({ testData }) {
  await activityFour .verifyIntroductionPageIsVisible();
});

When('the user clicks the Continue button on the Introduction page of Activity Four - Challenge Mode', async function ({ testData }) {
  await activityFour.clickOnIntroductionContinueButton();
});

Then('the first step of Activity Four - Challenge Mode should be displayed', async function ({ testData }) {
  await activityFour.verifyFirstStepIsVisible();
});

When('the user selects the response option according to the {string} for Activity Four - Challenge Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await activityFour.runScenarioPathForActivityFourChallengeMode(scenario,testData)
});

Then('the Report page of Activity Four - Challenge Mode should be visible', async function ({ testData }) {
  
});

Then('the report content should match the performed {string} for Activity Four - Challenge Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await summaryReportActivityFour.runScenarioPathForActivityFourChallengeMode(scenario,testData);
});

Then('the activity title and learning objectives should match the content matrix of Activity Four - Challenge Mode', async function ({ testData ,page,$testInfo}) {
  await activityFour.verifyTitleAndLearningObjectivesPage(testData,$testInfo);
});

Then('the introduction text should match the content matrix of Activity Four - Challenge Mode', async function ({ testData }) {
  await activityFour.verifyIntroductionPage(testData);
});

When('the user click on the Introduction button in more options menue items', async function ({ testData }) {
  await activityFour.clickOnMoreOptionPopupIntroductionButton();
});

Then('the Introduction popup should be visible and content should be as per content matrix', async function ({ testData }) {
  await activityFour.verifyIntroductionPopUp(testData);
});


When('the user click on the Learning Objective button in more options menue items', async function ({ testData }) {
  await activityFour.clickOnMoreOptionPopupLearningObjectiveButton();
});

Then('the Learning Objectives popup should be visible and content should be as per content matrix', async function ({ testData,$testInfo }) {
  await activityFour.verifyLearningObjectivesPopUp(testData,$testInfo);
});

Then('perfome accessibility scan for {string}', async function ({ testData,$testInfo }, pageName: string) {
  activityFour.performAccessivityScanForGivenPage($testInfo,pageName)
});

