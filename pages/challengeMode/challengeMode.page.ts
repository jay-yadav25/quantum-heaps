import { expect, Locator, FrameLocator, type Page } from '@playwright/test';

export class ChallengeMode {
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
  readonly intrductionPopupContinueButton: Locator;
  readonly chatEndMessage: Locator;

  constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.startButton = this.frameLocator.locator("//button[@class='start-btn']");
    this.inputField = this.frameLocator.locator("//input[@class='input']");
    this.avatarSelectionDoneButton = this.frameLocator.locator("//button[@id='avatar-done-btn']");
    this.doneSubmitButton = this.frameLocator.locator("//button[@id='chat-done-btn']");
    this.submitButton = this.frameLocator.locator("//button[@id='submit-btn']");
    this.retryButton = this.frameLocator.locator("//button[@id='retry-btn']");
    this.feedbackPopupText1 = this.frameLocator.locator("//div[@class='popup-content']//p[1]");
    this.feedbackPopupText2 = this.frameLocator.locator("//div[@class='popup-content']//p[2]");
    this.intrductionPopupContinueButton = this.frameLocator.locator(".continue-button");
    this.chatEndMessage = this.frameLocator.locator("//div[@class='chat-ended-msg']");
  }

  public async launchActivity() {
    await this.page.goto("https://dev-cengage-dho.zeuslearning.com/launcherpages/cengage_dho_launcher.html?dho=dho1&attemptId=1&lang=en");
  }

  public async runScenarioPath(path: string[], testData: any) {
    let previousStep: string | null = null;

    for (let i = 0; i < path.length; i++) {
      const step = path[i];

      // ❌ If RESTART3 → terminate and mark as failed
      if (step === 'RESTART3') {
        console.log(`❌ RESTART3 encountered — Last step was ${previousStep}`);
        await this.verifyFailedScenario(previousStep, testData);
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

      // 🎯 Handle regular interaction step
      await this.selectAndVerifyReplyText(step, testData);

      // Update previous step
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

    // Verify the text of each option
    await expect(this.frameLocator.locator(`//button[@id='${correctOptionID}']`).first()).toHaveText(correct);
    await expect(this.frameLocator.locator(`//button[@id='${incorrectOptionID}']`).first()).toHaveText(incorrect);
    await expect(this.frameLocator.locator(`//button[@id='${distractorOptionID}']`).first()).toHaveText(distractor);

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

    // Get the reply mood and text for the selected action
    const replyMood = actionDetails[actionKey + "_reply_mood"];
    const replyText = actionDetails[actionKey + "_reply"];
    const replyTextID = `${selectedOptionID}_rep_1`;

    // Define the selector for the reply mood based on the selected option ID
    const replyMoodSelector = `//span[@id='${replyTextID}']/parent::div/preceding-sibling::div/div[contains(@class, "patient-reaction")]`;

    // Verify the reply mood
    // console.log(this.page.locator(replyMoodSelector).innerText());
    // await expect(this.page.locator(replyMoodSelector).first()).toHaveText("(" + replyMood + ")");
    await expect(this.frameLocator.locator(`//span[@id='${replyTextID}']`)).toHaveText(replyText);
  }

  private async verifyFailedScenario(previousStep: any, testData: any) {
    // Verify text from chat section
    await expect(this.chatEndMessage).toHaveText("This conversation has ended without a positive resolution. Select the Done button to proceed.");
    await this.clickOnDoneButton();

    const [level, rawAction] = previousStep.split("_");
    const actionMap: { [key: string]: string } = {
      INCORRECT: "incorrect",
      DISTRACTOR: "distractor"
    };

    const actionKey = actionMap[rawAction.toUpperCase()];
    const actionDetails = testData[level];
    const attemptEndingText = actionDetails[actionKey + "_attempt_ending_popup_text"];
    const feedbackPopupFirstText = "You've reached the end of your attempts, and the conversation did not lead to a successful resolution. " + attemptEndingText;
    const feedbackPopupSecondText = "Select the Submit button to end the scenario.";

    // Verify text on popup for last incorrect attempt
    // await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    // await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    await this.clickOnSubmitButton();
  }

  private async verifyFailedScenario2(previousStep: any, testData: any, attemptNumber: string) {
    // Verify text from chat section
    await expect(this.chatEndMessage).toHaveText("This conversation has ended without a positive resolution. Select the Done button to proceed.");
    await this.clickOnDoneButton();

    const [level, rawAction] = previousStep.split("_");
    const actionMap: { [key: string]: string } = {
      INCORRECT: "incorrect",
      DISTRACTOR: "distractor"
    };

    const actionKey = actionMap[rawAction.toUpperCase()];
    const actionDetails = testData[level];
    const attemptEndingText = actionDetails[actionKey + "_attempt_ending_popup_text"];
    const feedbackPopupFirstText = "The conversation path you took didn't reach a positive resolution. " + attemptEndingText;
    const feedbackPopupSecondText = "Continue practicing your problem solving and communication skills by retrying the scenario once again or select the Submit button to end the scenario.";

    // Verify text on popup for incorrect attempt
    //await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    //await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    await this.clickOnRetryButton();
  }

  private async verifyPassedScenario() {
    await expect(this.chatEndMessage).toHaveText("This conversation has ended with a positive resolution. Select the Done button to proceed.");
    await this.clickOnDoneButton();

    // Verify text on popup
    const feedbackPopupFirstText = "Great job! You successfully navigated the conversation with empathy and patience, and demonstrated effective use of communication and problem solving skills to reach a positive outcome!";
    const feedbackPopupSecondText = "Select the Submit button to end the scenario.";

    // Verify text on popup for successful scenario
    //await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    //await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    await this.clickOnSubmitButton();
  }

  public async clickOnStartButton() {
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

  /**
   * Generates option IDs based on the level identifier
   * @param level The level identifier (e.g., "C1.2")
   * @returns Object containing IDs for the three options
   */
  private async getOptionIds(level: string) {
    const parts = level.replace("C", "").split(".");
    const section = parts.map((n, i) => {
      if (i === 0) return n.padStart(2, "0");
      return ((parseInt(parts[0]) - 1) * 10 + parseInt(n)).toString().padStart(2, "0");
    }).join("_");

    const base = `ch_${section}`;
    return {
      distractorOptionID: `${base}_opt_1`,
      correctOptionID: `${base}_opt_2`,
      incorrectOptionID: `${base}_opt_3`
    };
  }
}