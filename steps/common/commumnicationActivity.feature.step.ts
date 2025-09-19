

import { env } from 'process';
import { ActivityCommonPage } from '../../pages/commonPages/activityCommon.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();
let activityCommonPage : ActivityCommonPage ;


Before({ tags: '@dho' }, async ({ page }) => {
  activityCommonPage  = new ActivityCommonPage (page);
});

Given('the user has launched the activity {int} on the web', async function ({}, activityNumber: number)  {
  const environment = env["ENVIRONMENT"] || "STAGE";
  await activityCommonPage.launchActivity(environment,activityNumber);
});

Then('the avatar selection page content should be as per content matrix', async function ({ testData }) {
  await activityCommonPage.verifyAvatarSelectionPage(testData);
});


Then('the chat page content should be as per content matrix',async function ({ testData }) {
  await activityCommonPage.verifyChatSection(testData);
});



Then('perform accessibility scan for {string}', async function ({ testData,$testInfo }, pageName: string) {
  activityCommonPage.performAccessibilityScanForGivenPage($testInfo,pageName)
});

Then('the Learning Objectives page of {string} should be displayed',async function ({ testData }) {
  await activityCommonPage.verifyLearningObjectivePageIsVisible();
});

Then('the activity title and learning objectives should match the content matrix of {string}',async function ({ testData ,page,$testInfo}) {
  await activityCommonPage.verifyTitleAndLearningObjectivesPage(testData,$testInfo);
});

When('the user clicks the Start button on the Learning Objectives page of {string}', async function ({ testData }) {
  await activityCommonPage .clickOnStartButton();
});

Then('the Introduction page of {string} should be visible', async function ({ testData }) {
  await activityCommonPage .verifyIntroductionPageIsVisible();
});

Then('the introduction text should match the content matrix of {string}', async function ({ testData }) {
  await activityCommonPage.verifyIntroductionPage(testData);
});

When('the user clicks the Continue button on the Introduction page of {string}', async function ({ testData }) {
  await activityCommonPage.clickOnIntroductionContinueButton();
});

Then('the first step of {string} should be displayed', async function ({ testData }) {
  await activityCommonPage.verifyFirstStepIsVisible();
});

When('the user click on the Introduction button in more options menu items', async function ({ testData }) {
  await activityCommonPage.clickOnMoreOptionPopupIntroductionButton();
});

Then('the Introduction popup content should be as per content matrix', async function ({ testData }) {
  await activityCommonPage.verifyIntroductionPopUp(testData);
});

Then('the user clicks the Continue button on the Learning Objective popup of {string}', async function ({ testData }, arg: string){
  await activityCommonPage.clickOnContinueButtonIntroAndLoPopup();
});


When('the user click on the Learning Objective button in more options menu items', async function ({ testData }) {
  await activityCommonPage.clickOnMoreOptionPopupLearningObjectiveButton();
});

Then('the Learning Objectives popup should be visible and content should be as per content matrix', async function ({ testData }) {
  await activityCommonPage.verifyLearningObjectivesPopUp(testData);
});
