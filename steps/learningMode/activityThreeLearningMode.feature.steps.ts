
import { ActivityThree } from '../../pages/activityThreeLearningMode/activityThreeLearningMode.page';
import { SummaryReportActivityThree } from '../../pages/commonPages/summaryReportActivityThree.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();
let activityThree: ActivityThree;
let summaryReportActivityThree: SummaryReportActivityThree;

Before({ tags: '@dho' }, async ({ page }) => {
  activityThree = new ActivityThree(page);
  summaryReportActivityThree=new SummaryReportActivityThree(page);
});


Given('the user has launched Activity Three - Learning Mode on the web',async function ({ testData }) {
  await activityThree.launchActivity();
});

Then('the Learning Objectives page of Activity Three - Learning Mode should be displayed',async function ({ testData }) {
  await activityThree.verifyLearningObjectivePageIsVisible();
});

Then('the activity title and learning objectives should match the content matrix of Activity Three - Learning Mode',async function ({ testData }) {
  await activityThree.verifyTitleAndLearningObjectives();
});

When('the user clicks the Start button on the Learning Objectives page of Activity Three - Learning Mode', async function ({ testData }) {
  await activityThree.clickOnStartButton();
});


Then('the Introduction page of Activity Three - Learning Mode should be visible', async function ({ testData }) {
  await activityThree.verifyIntroductionPageIsVisible();
});

Then('the introduction text should match the content matrix of Activity Three - Learning Mode', async function ({ testData }) {
  await activityThree.verifyIntroduction();
});

When('the user clicks the Continue button on the Introduction page of Activity Three - Learning Mode', async function ({ testData }) {
  await activityThree.clickOnIntroductionContinueButton();
});

Then('the first step of Activity Three - Learning Mode should be displayed', async function ({ testData }) {
  await activityThree.verifyFirstStepIsVisible();
});

When('the user selects the response option according to the {string} for Activity Three - Learning Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await activityThree.runScenarioPathForActivityThreeLearnigMode(scenario,testData)
});

Then('the Report page of Activity Three - Learning Mode should be visible', async function ({ testData }) {
  
});

Then('the report content should match the performed {string} for Activity Three - Learning Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await summaryReportActivityThree.runScenarioPathForActivityThreeLearnigMode(scenario,testData);
});
