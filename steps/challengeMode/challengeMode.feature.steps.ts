import { ChallengeMode } from '../../pages/challengeMode/challengeMode.page';
import { LearningObjectivePage } from '../../pages/challengeMode/learningObjective.page';
import { SummaryReport } from '../../pages/commonPages/summaryReport.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();
let challengeMode: ChallengeMode;
let summaryReport: SummaryReport;
let learningObjectivePage: LearningObjectivePage;

Before({ tags: '@dho' }, async ({ page }) => {
  challengeMode = new ChallengeMode(page);
  summaryReport = new SummaryReport(page);
  learningObjectivePage = new LearningObjectivePage(page);

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



Then('the Chat section should be displayed', async function ({ }) {

});

When('the user selects the chat option for scenario {string}', async function ({ loginData, testData }, scenarioNumber: string) {
  const scenarioPath = loginData[scenarioNumber];
  await challengeMode.runScenarioPath(scenarioPath, testData);
});

Then('Verify the scenario score {string}', async function ({ loginData, testData }, scenarioNumber: string) {
  const scenarioPath = loginData[scenarioNumber];
  await summaryReport.verifyFinalScore(scenarioPath, testData);
});





Given('the learning objectives screen should be displayed', async function ({ testData }) {
  await learningObjectivePage.verifyLearningObjectivesPageIsDisplayed(testData);
});

Then('the activity name and learning objectives should be same as as per design', async function ({ testData }) {
  await learningObjectivePage.verifyLearningObjectivess(testData);
});
When('the user clicks the Start button on the learning objectives', async function ({  }) {
  await learningObjectivePage.clickOnLearningObjectivePageStartButton();
});

Then('introduction popup shoudl be displayed', async function ({ }) {
 // await learningObjectivePage.clickOnLearningObjectivePageStartButton();
});

Then('the introdution popup text and title should be as per design', async function ({ testData }) {
  await learningObjectivePage.verifyIntroductionPopup(testData);
});

When('the user clicks the Continue button on the introduction popup', async function ({ }) {
  await learningObjectivePage.clickOnintrductionPopupContinueButton();
});

Then('the Choose an Avatar page should be open', async function ({ }) {
  await learningObjectivePage.verifyAvatarSelectionPage();
});

// 7. Missing step definition for "features\challengeMode.feature:12:5"
When('User click on option button on choose an avatar page', async function ({ }) {
  await learningObjectivePage.clickOptionButton();
});

Then('menu popup should open having introduction and learing objective button', async function ({ }) {
  await learningObjectivePage.verifyMenuPopup();
});

Then('choose an avatar button should be disable on menu popup in avatar page', async function ({ }) {
  await learningObjectivePage.verifyAvatarButtonDisableOnAvatarPage();
});


When('the user fill the name in input field', async function ({ }) {
await learningObjectivePage.enterName("jay");
await learningObjectivePage.selectAvatar();
});

Then('Avatar page done button should be enable', async function ({ }) {
await learningObjectivePage.verifyDoneButtonEnabled();
});

When('User click on done button on choose an avatar page', async function ({ }) {
await learningObjectivePage.clickAvatarDoneButton();
});

Then('Chat section should be open', async function ({ testData}) {
await learningObjectivePage.verifyChatSection(testData);
});

Then('the step instrustion title and text should be as per design', async function ({ }) {

});