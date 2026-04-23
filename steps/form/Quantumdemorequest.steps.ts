
import { QuantumDemoRequestPage } from '../../pages/Quantumdemorequest.page';
import { createBddCustom } from '../common/createBddCustom';

const { Given, When, Then, Before } = createBddCustom();

let quantumDemoRequestPage: QuantumDemoRequestPage;

// ── Hooks
Before({}, async ({ page }) => {
  quantumDemoRequestPage = new QuantumDemoRequestPage(page);
});

Given('User navigates to the Quantum Heaps home page', async function ({}) {
  await quantumDemoRequestPage.navigateToHomePage();
});

When('User clicks the Get Started button', async function ({}) {
  await quantumDemoRequestPage.clickGetStarted();
});

When('User closes the dialog popup', async function ({}) {
  await quantumDemoRequestPage.closeDialogPopup();
});

When('User clicks the Start Free No Card Needed link', async function ({}) {
  await quantumDemoRequestPage.clickStartFreeLink();
});

When(
  'User fills in the demo request form for {string}',
  async function ({ testData }, userType: string) {
    const userData = testData.demoRequestData[userType];

    if (!userData) {
      throw new Error(
        `No test data found for user type: "${userType}". ` +
          `Please add an entry to testData.json under "demoRequestData".`
      );
    }

    const { firstName, lastName, companyName, mobile, email, message } = userData;
    await quantumDemoRequestPage.fillDemoRequestForm(
      firstName,
      lastName,
      companyName,
      mobile,
      email,
      message
    );
  }
);

When('User clicks the Request Your Custom Demo button', async function ({}) {
  await quantumDemoRequestPage.clickRequestDemoButton();
});

When('User accepts the data collection agreement', async function ({}) {
  await quantumDemoRequestPage.acceptDataCollectionConsent();
});

When('User submits the demo request form', async function ({}) {
  await quantumDemoRequestPage.submitDemoRequest();
});

Then(
  'the demo request should be submitted successfully for {string}',
  async function ({ testData }, userType: string) {
    await quantumDemoRequestPage.verifySubmissionSuccess();
  }
);