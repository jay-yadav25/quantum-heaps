import { createBddCustom } from '../common/createBddCustom';
import { Page } from '@playwright/test';
import { DiagnosticTesting } from '../../pages/diagnosticTesting/excelFileReader.page';
import { CommonFunction } from '../../pages/commonPages/commonFunction.page';
import { l10n } from '../../utils/uiLocalizedStrings';
import { ScenarioWalker } from '../../pages/commonPages/test.page';
import { ScenarioWalker1 } from '../../pages/diagnosticTesting/allPathJsonGenerator.page';

const { Given, When, Then, Before } = createBddCustom();
let diagnosticTesting: DiagnosticTesting;
let commonFunction: CommonFunction;
let testFunction: ScenarioWalker;
let scenarioWalker1: ScenarioWalker1;

Before({ tags: '@ccs' }, async ({ page, testData }) => {
  diagnosticTesting = new DiagnosticTesting(page);
  commonFunction = new CommonFunction(page);
  testFunction = new ScenarioWalker(page);
  scenarioWalker1 = new ScenarioWalker1(page);

});

Given('User launched activty on scorm', async ({ page }: { page: Page }) => {
  await page.goto('https://stage-cengage-ccl-scorm.zeuslearning.com/clinical_sims_launcher.html?launchType=0&ccl=ccl8&attemptId=1&name=Demo126');
  await page.waitForTimeout(18000);
});

When('the user clicks the Continue button', async function ({ }) {
  await diagnosticTesting.clickOnContonueButton();
  await scenarioWalker1.exploreAllScenarioPaths();
  // await scenarioWalker1.exploreScenarioPaths(2);
  // await scenarioWalker1.exploreScenarioPaths(3);
  // await scenarioWalker1.exploreScenarioPaths(4);
  // await scenarioWalker1.exploreScenarioPaths(5);
  //await testFunction.exploreScenarioPaths();
  //await diagnosticTesting.readExcelFile();
});

Then('the step introduction popup should close', async function ({ }) {

});

Then('the first step of the activity should open', async function ({ }) {

});

When('User click on EHR button', async function ({ }) {
  await commonFunction.openEHRFrom();
  //await diagnosticTesting.readExcelFile();
});

Then('EHR forum should be open', async function ({ }) {

});

When('User click on EHR close button', async function ({ }) {
  await commonFunction.closeEHRFrom();
});

Then('EHR form should be close', async function ({ }) {

});
