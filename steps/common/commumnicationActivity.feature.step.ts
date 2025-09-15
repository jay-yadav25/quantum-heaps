

import { env } from 'process';
import { ActivityCommonPage } from '../../pages/commonPages/activityCommon.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();
let activityCommonpage : ActivityCommonPage ;


Before({ tags: '@dho' }, async ({ page }) => {
  activityCommonpage  = new ActivityCommonPage (page);
});

Given('the user has launched the activity {int} on the web', async function ({}, activityNumber: number)  {
  const environment = env["ENVIRONMENT"] || "STAGE";
  await activityCommonpage.launchActivity(environment,activityNumber);
});

Then('the avatar selection page content should be as per content matrix', async function ({ testData }) {
  await activityCommonpage.verifyAvatarSelectionPage(testData);
});


Then('the chat page content should be as per content matrix',async function ({ testData }) {
  await activityCommonpage.verifyChatSection(testData);
});



Then('perfome accessibility scan for {string}', async function ({ testData,$testInfo }, pageName: string) {
  activityCommonpage.performAccessivityScanForGivenPage($testInfo,pageName)
});

Then('the Learning Objectives page of {string} should be displayed',async function ({ testData }) {
  await activityCommonpage.verifyLearningObjectivePageIsVisible();
});

Then('the activity title and learning objectives should match the content matrix of {string}',async function ({ testData ,page,$testInfo}) {
  await activityCommonpage.verifyTitleAndLearningObjectivesPage(testData,$testInfo);
});

When('the user clicks the Start button on the Learning Objectives page of {string}', async function ({ testData }) {
  await activityCommonpage .clickOnStartButton();
});

Then('the Introduction page of {string} should be visible', async function ({ testData }) {
  await activityCommonpage .verifyIntroductionPageIsVisible();
});

Then('the introduction text should match the content matrix of {string}', async function ({ testData }) {
  await activityCommonpage.verifyIntroductionPage(testData);
});

When('the user clicks the Continue button on the Introduction page of {string}', async function ({ testData }) {
  await activityCommonpage.clickOnIntroductionContinueButton();
});

Then('the first step of {string} should be displayed', async function ({ testData }) {
  await activityCommonpage.verifyFirstStepIsVisible();
});

When('the user click on the Introduction button in more options menue items', async function ({ testData }) {
  await activityCommonpage.clickOnMoreOptionPopupIntroductionButton();
});

Then('the Introduction popup content should be as per content matrix', async function ({ testData }) {
  await activityCommonpage.verifyIntroductionPopUp(testData);
});

Then('the user clicks the Continue button on the Learning Objective popup of {string}', async function ({ testData }, arg: string){
  await activityCommonpage.clickOnContinueButtonIntroAndLoPopup();
});


When('the user click on the Learning Objective button in more options menue items', async function ({ testData }) {
  await activityCommonpage.clickOnMoreOptionPopupLearningObjectiveButton();
});

Then('the Learning Objectives popup should be visible and content should be as per content matrix', async function ({ testData }) {
  await activityCommonpage.verifyLearningObjectivesPopUp(testData);
});
