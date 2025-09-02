

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


Then('the Learning Objectives page of Activity Six - Learning Mode should be displayed',async function ({ testData }) {
  await activityFour .verifyLearningObjectivePageIsVisible();
});

When('the user clicks the Start button on the Learning Objectives page of Activity Six - Learning Mode', async function ({ testData }) {
  await activityFour .clickOnStartButton();
});


Then('the Introduction page of Activity Six - Learning Mode should be visible', async function ({ testData }) {
  await activityFour .verifyIntroductionPageIsVisible();
});

When('the user clicks the Continue button on the Introduction page of Activity Six - Learning Mode', async function ({ testData }) {
  await activityFour.clickOnIntroductionContinueButton();
});

Then('the first step of Activity Six - Learning Mode should be displayed', async function ({ testData }) {
  await activityFour.verifyFirstStepIsVisible();
});

When('the user selects the response option according to the {string} for Activity Six - Learning Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await activityFour.runScenarioPathForActivityFourChallengeMode(scenario,testData)
});

Then('the Report page of Activity Six - Learning Mode should be visible', async function ({ testData }) {
  
});

Then('the report content should match the performed {string} for Activity Six - Learning Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await summaryReportActivityFour.runScenarioPathForActivityFourChallengeMode(scenario,testData);
});

Then('the activity title and learning objectives should match the content matrix of Activity Six - Learning Mode', async function ({ testData }) {
  await activityFour.verifyTitleAndLearningObjectivesPage(testData);
});

Then('the introduction text should match the content matrix of Activity Six - Learning Mode', async function ({ testData }) {
  await activityFour.verifyIntroductionPage(testData);
});


