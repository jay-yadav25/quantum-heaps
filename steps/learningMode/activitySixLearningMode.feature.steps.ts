

import env from '../../fixtures/env';
import { ActivitySix } from '../../pages/activitySixLearningMode/activitySixLearningMode.page';

import { SummaryReportActivityFour } from '../../pages/commonPages/summaryReportActivityFour.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();
let activitySix : ActivitySix ;
let summaryReportActivityFour : SummaryReportActivityFour ;

Before({ tags: '@dho' }, async ({ page }) => {
  activitySix  = new ActivitySix (page);
  summaryReportActivityFour =new SummaryReportActivityFour (page);
});


Then('the Learning Objectives page of Activity Six - Learning Mode should be displayed',async function ({ testData }) {
  await activitySix .verifyLearningObjectivePageIsVisible();
});

When('the user clicks the Start button on the Learning Objectives page of Activity Six - Learning Mode', async function ({ testData }) {
  await activitySix .clickOnStartButton();
});


Then('the Introduction page of Activity Six - Learning Mode should be visible', async function ({ testData }) {
  await activitySix .verifyIntroductionPageIsVisible();
});

When('the user clicks the Continue button on the Introduction page of Activity Six - Learning Mode', async function ({ testData }) {
  await activitySix.clickOnIntroductionContinueButton();
});

Then('the first step of Activity Six - Learning Mode should be displayed', async function ({ testData }) {
  await activitySix.verifyFirstStepIsVisible();
});

When('the user selects the response option according to the {string} for Activity Six - Learning Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await activitySix.runScenarioPathForActivitySixLearningMode(scenario,testData)
});

Then('the Report page of Activity Six - Learning Mode should be visible', async function ({ testData }) {
  
});

Then('the report content should match the performed {string} for Activity Six - Learning Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await summaryReportActivityFour.runScenarioPathForActivityFourChallengeMode(scenario,testData);
});

Then('the activity title and learning objectives should match the content matrix of Activity Six - Learning Mode', async function ({ testData }) {
  await activitySix.verifyTitleAndLearningObjectivesPage(testData);
});

Then('the introduction text should match the content matrix of Activity Six - Learning Mode', async function ({ testData }) {
  await activitySix.verifyIntroductionPage(testData);
});


