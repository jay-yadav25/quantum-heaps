import { expect, Locator, FrameLocator, type Page } from '@playwright/test';

export class ActivityFiveChallengeMode {
  readonly page: Page;
  private readonly frameLocator: FrameLocator;
  readonly startButton: Locator;
  readonly inputField: Locator;
  readonly avatarSelectionDoneButton: Locator;
  readonly doneSubmitButton: Locator;
  readonly submitButton: Locator;
  readonly retryButton: Locator;
  readonly feedbackPopupText1: Locator;
  readonly feedbackPopupText2: Locator;
  readonly feedbackPopupText3: Locator;
  readonly intrductionPopupContinueButton: Locator;
  readonly chatEndMessage1: Locator;
  readonly chatEndMessage2: Locator;
  readonly noOfAttemptChatPopup: Locator;
  readonly respondButton: Locator;
  readonly restartButton: Locator;

  constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.startButton = this.frameLocator.locator("//button[@id='start-btn']").first();
    this.inputField = this.frameLocator.locator("//input[@class='input']");
    this.avatarSelectionDoneButton = this.frameLocator.locator("//button[@id='avatar-done-btn']").first();
    this.doneSubmitButton = this.frameLocator.locator("//button[@id='chat-done-btn']").first();
    this.restartButton = this.frameLocator.locator("//button[@id='restart-btn']").first();
    this.respondButton = this.frameLocator.locator("//button[@id='respond-btn']").first();
    this.submitButton = this.frameLocator.locator("//button[@id='submit-btn']").first();
    this.retryButton = this.frameLocator.locator("//button[@id='retry-btn']").first();
    this.feedbackPopupText1 = this.frameLocator.locator("//div[@class='popup-content-container']//p[1]");
    this.feedbackPopupText2 = this.frameLocator.locator("//div[@class='popup-content-container']//p[2]");
    this.feedbackPopupText3 = this.frameLocator.locator("//div[@class='popup-content-container']//span").first();
    this.intrductionPopupContinueButton = this.frameLocator.locator(".continue-button").first();
    this.chatEndMessage1 = this.frameLocator.locator("//div[@class='chat-end-message-bg']/div/p");
    this.chatEndMessage2 = this.frameLocator.locator("//div[@class='chat-end-message-bg']/p");
    this.noOfAttemptChatPopup = this.frameLocator.locator("//div[@class='popup-header']/span");
  }

  public async launchActivity(activityNumber: number) {
    if (activityNumber == 5) {
      //await this.page.goto("https://dev-cengage-dho.zeuslearning.com/launcherPages/cengage_dho_launcher.html?launchType=1&dho=cs_c_01&attemptId=1");
      await this.page.goto("https://dev-cengage-dho.zeuslearning.com/launcherPages/cengage_dho_launcher.html?launchType=1&dho=cs_c_05&attemptId=1");
    } else if (activityNumber == 2) {
      await this.page.goto("https://cengage-dho.zeuslearning.com/index.html?launchType=1&dho=cs_l_02&attemptId=0");

    }
  }

  public async runScenarioPath(path: string[], testData: any) {
    let previousStep: string | null = null;
    await this.respondButton.click();
    for (let i = 0; i < path.length; i++) {
      const step = path[i];
      if (step === 'RESTART3') {
        console.log(`❌ RESTART3 encountered — Last step was ${previousStep}`);
        await this.verifyFailedScenario(previousStep, testData);
        break;
      }
      if (step.startsWith('SUBMIT')) {
        const attemptNumber = step.replace('SUBMIT', '');
        console.log(` Submiting scenario — Last step was ${previousStep}`);
        await this.verifyFailedScenarioInbeweenSubmit(previousStep, testData, attemptNumber);
        break;
      }
      // ✅ If COMPLETE → terminate and mark as passed
      if (step === 'COMPLETE') {
        console.log(`✅ COMPLETE reached — Last step was ${previousStep}`);
        await this.verifyPassedScenario();
        break;
      }

      // 🔁 Handle RESTART1 / RESTART2
      if (step.startsWith('RESTART')) {
        const attemptNumber = step.replace('RESTART', '');
        console.log(`🔁 Restarting attempt ${attemptNumber} — Last step was ${previousStep}`);
        await this.verifyFailedScenario2(previousStep, testData, attemptNumber);
        continue; // Skip rest of the loop for RESTART
      }
      if (step.startsWith('REATTEMPT')) {
        const attemptNumber = step.replace('REATTEMPT', '');
        console.log(`🔁 Restarting attempt ${attemptNumber} — Last step was ${previousStep}`);
        await this.verifyReattempt(previousStep, testData, attemptNumber);
        continue; // Skip rest of the loop for RESTART
      }
      await this.selectAndVerifyReplyText(step, testData);
      previousStep = step;
    }
  }

  private async selectAndVerifyReplyText(step: string, testData: any) {
    const [level, rawAction] = step.split("_");

    const actionMap: { [key: string]: string } = {
      CORRECT: "ideal",
      INCORRECT: "incorrect",
      DISTRACTOR: "distractor"
    };

    const actionDetails = testData[level];
    const correct = actionDetails["ideal"];
    const incorrect = actionDetails["incorrect"];
    const distractor = actionDetails["distractor"];

    // Get the option IDs
    const { correctOptionID, incorrectOptionID, distractorOptionID } = await this.getOptionIds(level);
    

    // // Verify the text of each option
    
    await expect(this.frameLocator.locator(`//button[@id='${correctOptionID}']//span//span[2]`).first()).toHaveText(correct);
    await expect(this.frameLocator.locator(`//button[@id='${incorrectOptionID}']//span//span[2]`).first()).toHaveText(incorrect);
    await expect(this.frameLocator.locator(`//button[@id='${distractorOptionID}']//span//span[2]`).first()).toHaveText(distractor);

    // Determine which option to click based on the action
    const actionKey = actionMap[rawAction.toUpperCase()];
    let selectedOptionID: string;

    switch (actionKey) {
      case "ideal":
        selectedOptionID = correctOptionID;
        break;
      case "incorrect":
        selectedOptionID = incorrectOptionID;
        break;
      case "distractor":
        selectedOptionID = distractorOptionID;
        break;
      default:
        throw new Error(`Unknown actionKey: ${actionKey}`);
    }

    // Click the selected option
    await this.frameLocator
      .locator(`//button[@id='${selectedOptionID}']`).first()
      .click();
    if (selectedOptionID === "ch_01_opt_2" || selectedOptionID === "ch_01_11_opt_2" || selectedOptionID === "ch_01_12_opt_2"|| selectedOptionID === "ch_03_opt_2" ||selectedOptionID === "ch_04_opt_3"||selectedOptionID === "ch_04_opt_1"||selectedOptionID === "ch_05_opt_1"||selectedOptionID === "ch_05_opt_2"||selectedOptionID === "ch_05_opt_3") {
      //for C1-C,C1.1-C,C1.2-C,C3-C,C4-D,C4-I,C5CID
      const replierName = actionDetails[actionKey + "_replier_name"];
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      const replierNameLocator = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-name")]`;
      await expect(this.frameLocator.locator(replierNameLocator)).toHaveText(replierName + "");
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);

      const replyText2 = actionDetails[actionKey + "_reply2"];
      const replyTextID2 = `${selectedOptionID}_rep_2`;
      await expect(this.frameLocator.locator(`//span[@id='${replyTextID2}']`)).toHaveText(replyText2);

      const replierName3 = actionDetails[actionKey + "_replier_name3"];
      const replyMood3 = actionDetails[actionKey + "_reply_mood3"];
      const replyText3 = actionDetails[actionKey + "_reply3"];
      const replyTextID3 = `${selectedOptionID}_rep_3`;

      const replyMoodSelector3 = `//div[@id='${replyTextID3}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      const replierNameLocator3 = `//div[@id='${replyTextID3}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-name")]`;
      await expect(this.frameLocator.locator(replierNameLocator3)).toHaveText(replierName3 + "");
      await expect(this.frameLocator.locator(replyMoodSelector3)).toHaveText("[" + replyMood3 + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID3}']`)).toHaveText(replyText3);

    } else if (selectedOptionID == "ch_02_opt_2" || selectedOptionID === "ch_02_21_opt_2") {
      //for C2-C and C2.1-C
      const replierName = actionDetails[actionKey + "_replier_name"];
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      const replierNameLocator = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-name")]`;
      await expect(this.frameLocator.locator(replierNameLocator)).toHaveText(replierName + "");
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);

      const replyText2 = actionDetails[actionKey + "_reply2"];
      const replyTextID2 = `${selectedOptionID}_rep_2`;
      await expect(this.frameLocator.locator(`//span[@id='${replyTextID2}']`)).toHaveText(replyText2);

    } else {
      // Get the reply mood and text for the selected action
      const replierName = actionDetails[actionKey + "_replier_name"];
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      const replierNameLocator = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-name")]`;
      await expect(this.frameLocator.locator(replierNameLocator)).toHaveText(replierName + "");
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);
    }
  }
  //termination at 3rd attempt only submit options
  private async verifyFailedScenario(previousStep: any, testData: any) {
    await expect(this.chatEndMessage1).toHaveText("This conversation has ended without a positive resolution.");
    await expect(this.chatEndMessage2).toHaveText("Select the Continue button to proceed.");
    await this.clickOnDoneButton();
    const [level, rawAction] = previousStep.split("_");
    const actionMap: { [key: string]: string } = {
      INCORRECT: "incorrect",
      DISTRACTOR: "distractor"
    };

    const actionKey = actionMap[rawAction.toUpperCase()];
    const actionDetails = testData[level];
    const attemptEndingText = actionDetails[actionKey + "_attempt_ending_popup_text"];
    const feedbackPopupFirstText = "You've reached the end of your attempts, and the conversation did not lead to a successful resolution.  " + attemptEndingText;
    const feedbackPopupSecondText = "Select the Submit button to end the scenario and submit your results to your teacher.";

    // Verify text on popup for last incorrect attempt
    await expect(this.feedbackPopupText3).toHaveText(feedbackPopupFirstText);
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupSecondText);
    await this.clickOnSubmitButton();
    await this.page.pause();
  }
//retry popup
  private async verifyFailedScenario2(previousStep: any, testData: any, attemptNumber: any) {
    // Verify text from chat section
    await expect(this.chatEndMessage1).toHaveText("This conversation has ended without a positive resolution.");
    await expect(this.chatEndMessage2).toHaveText("Select the Continue button to proceed.");
    await this.clickOnDoneButton();

    const [level, rawAction] = previousStep.split("_");
    const actionMap: { [key: string]: string } = {
      INCORRECT: "incorrect",
      DISTRACTOR: "distractor"
    };
    await expect(this.noOfAttemptChatPopup).toHaveText(`Attempts Remaining: ${3 - attemptNumber}`);

    const actionKey = actionMap[rawAction.toUpperCase()];
    const actionDetails = testData[level];
    const attemptEndingText = actionDetails[actionKey + "_attempt_ending_popup_text"];
    const feedbackPopupFirstText = "The conversation path you took didn't reach a positive resolution.  " + attemptEndingText;
    const feedbackPopupSecondText = "Continue practicing your problem solving and communication skills by retrying the scenario once again or select the Submit button to end the scenario and submit your results to your teacher.";

    // Verify text on popup for incorrect attempt
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    await this.clickOnRetryButton();
    await this.respondButton.click();
  }

  private async verifyReattempt(previousStep: any, testData: any, attemptNumber: any) {
    // Verify text from chat section
    await expect(this.chatEndMessage1).toHaveText("This conversation has ended with a positive resolution.");
    await expect(this.chatEndMessage2).toHaveText("Select the Continue button to proceed.");
    await this.clickOnDoneButton();

    const [level, rawAction] = previousStep.split("_");
    const actionMap: { [key: string]: string } = {
      INCORRECT: "incorrect",
      DISTRACTOR: "distractor"
    };
    await expect(this.noOfAttemptChatPopup).toHaveText(`Attempts Remaining: ${3 - attemptNumber}`);

    const actionKey = actionMap[rawAction.toUpperCase()];
    const actionDetails = testData[level];
    //const attemptEndingText = actionDetails[actionKey + "_attempt_ending_popup_text"];
    const feedbackPopupFirstText = "Great job! You successfully navigated the conversation with empathy and patience, and demonstrated effective use of communication and problem solving skills to reach a positive outcome!";
    const feedbackPopupSecondText = "Select the Restart button to retry the scenario again from the start or select the Submit button to finish the scenario and submit your results to your teacher.";

    // Verify text on popup for incorrect attempt
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    await this.restartButton.click();
    await this.respondButton.click();
  }
  private async verifyFailedScenarioInbeweenSubmit(previousStep: any, testData: any, attemptNumber: any) {
    // Verify text from chat section
    await expect(this.chatEndMessage1).toHaveText("This conversation has ended without a positive resolution.");
    await expect(this.chatEndMessage2).toHaveText("Select the Continue button to proceed.");
    await this.clickOnDoneButton();

    const [level, rawAction] = previousStep.split("_");
    const actionMap: { [key: string]: string } = {
      INCORRECT: "incorrect",
      DISTRACTOR: "distractor"
    };
    await expect(this.noOfAttemptChatPopup).toHaveText(`Attempts Remaining: ${3 - attemptNumber}`);
    const actionKey = actionMap[rawAction.toUpperCase()];
    const actionDetails = testData[level];
    const attemptEndingText = actionDetails[actionKey + "_attempt_ending_popup_text"];
    const feedbackPopupFirstText = "The conversation path you took didn't reach a positive resolution.  " + attemptEndingText;
    const feedbackPopupSecondText = "Continue practicing your problem solving and communication skills by retrying the scenario once again or select the Submit button to end the scenario and submit your results to your teacher.";

    // Verify text on popup for incorrect attempt
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    await this.clickOnSubmitButton();
    await this.page.pause();
  }
  private async verifyPassedScenario() {
    await expect(this.chatEndMessage1).toHaveText("This conversation has ended with a positive resolution.");
    await expect(this.chatEndMessage2).toHaveText("Select the Continue button to proceed.");
    await this.clickOnDoneButton();

    // Verify text on popup
    const feedbackPopupFirstText = "Great job! You successfully navigated the conversation with enthusiasm, patience, and responsibility, and demonstrated effective use of communication and problem solving skills to reach a positive outcome!";
    const feedbackPopupSecondText = "Select the Submit button to end the scenario and submit your results to your teacher.";

    // Verify text on popup for successful scenario
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    //await this.page.pause();
    await this.clickOnSubmitButton();
    await this.page.pause();
  }

  public async clickOnStartButton() {
    await this.page.waitForTimeout(15000);
    await this.startButton.click();
    await this.intrductionPopupContinueButton.click();
  }

  public async typeInInputText(text: string) {
    await this.inputField.fill(text);
  }

  public async clickOnAvatarSelectionDone() {
    await this.avatarSelectionDoneButton.click();
  }

  public async clickOnDoneButton() {
    await this.doneSubmitButton.click();
  }

  public async clickOnSubmitButton() {
    await this.submitButton.click();
  }

  public async clickOnRetryButton() {
    await this.retryButton.click();
  }

  private async getOptionIds(level: string) {
  // Remove the "C" prefix and split by "."
  const parts = level.replace("C", "").split(".");

  let base: string;

  // Special case: C2.1 → ch_02_21_opt_2
  if (level === "C2.1") {
    base = `ch_02_21`;
    return {
      distractorOptionID: `${base}_opt_1`,
      correctOptionID: `${base}_opt_2`,
      incorrectOptionID: `${base}_opt_3`
    };
  }

  // Handle different level depths
  if (parts.length === 1) {
    // Level 1 (e.g., "C1" → "ch_01_opt_X")
    const mainSection = parts[0].padStart(2, "0");
    base = `ch_${mainSection}`;
  } else if (parts.length === 2) {
    // Level 2 (e.g., "C1.1" → "ch_01_11_opt_X")
    const mainSection = parts[0].padStart(2, "0");
    base = `ch_${mainSection}_1${parts[1]}`;
  } else {
    throw new Error(`Unsupported level format: ${level}`);
  }

  return {
    distractorOptionID: `${base}_opt_1`,
    correctOptionID: `${base}_opt_2`,
    incorrectOptionID: `${base}_opt_3`
  };
}

}