

import env from '../../fixtures/env';
import { ActivityFour } from '../../pages/challengeMode/activityFourChallengeMode.page';
import { SummaryReportActivityFour } from '../../pages/challengeMode/summaryReportActivityFour.page';
import { ActivitySix } from '../../pages/learningMode/activitySixLearningMode.page';
import { ActivityThree } from '../../pages/learningMode/activityThreeLearningMode.page';
import { SummaryReportActivitySix } from '../../pages/learningMode/summaryReportActivitySix.page';
import { SummaryReportActivityThree } from '../../pages/learningMode/summaryReportActivityThree.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();
let activityFour : ActivityFour ;
let summaryReportActivityFour : SummaryReportActivityFour ;
let activityThree: ActivityThree;
let summaryReportActivityThree: SummaryReportActivityThree;
let activitySix : ActivitySix ;
let summaryReportActivitySix : SummaryReportActivitySix ;



Before({ tags: '@dho' }, async ({ page }) => {
  activityFour  = new ActivityFour (page);
  summaryReportActivityFour =new SummaryReportActivityFour (page);
  activityThree = new ActivityThree(page);
  summaryReportActivityThree=new SummaryReportActivityThree(page);
  activitySix  = new ActivitySix (page);
  summaryReportActivitySix =new SummaryReportActivitySix (page);
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

//Activity Three
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

//Activity Six
When('the user selects the response option according to the {string} for Activity Six - Learning Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await activitySix.runScenarioPath(scenario,testData)
});

Then('the Report page of Activity Six - Learning Mode should be visible', async function ({ testData }) {
  
});

Then('the report content should match the performed {string} for Activity Six - Learning Mode', async function ({testData,loginData}, scenarioNumber: string) {
  const scenario = loginData[scenarioNumber];
  await summaryReportActivitySix.runScenarioPathForActivitySixLearnigMode(scenario,testData);
});





