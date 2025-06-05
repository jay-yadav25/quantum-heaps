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
  readonly feedbackPopupText3: Locator;
  readonly intrductionPopupContinueButton: Locator;
  readonly chatEndMessage1: Locator;
  readonly chatEndMessage2: Locator;
  readonly noOfAttemptChatPopup: Locator;

  constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.startButton = this.frameLocator.locator("//button[@id='start-btn']");
    this.inputField = this.frameLocator.locator("//input[@class='input']");
    this.avatarSelectionDoneButton = this.frameLocator.locator("//button[@id='avatar-done-btn']");
    this.doneSubmitButton = this.frameLocator.locator("//button[@id='chat-done-btn']");
    this.submitButton = this.frameLocator.locator("//button[@id='submit-btn']");
    this.retryButton = this.frameLocator.locator("//button[@id='retry-btn']");
    this.feedbackPopupText1 = this.frameLocator.locator("//div[@class='popup-content-container']//p[1]");
    this.feedbackPopupText2 = this.frameLocator.locator("//div[@class='popup-content-container']//p[2]");
    this.feedbackPopupText3 = this.frameLocator.locator("//div[@class='popup-content-container']//span").first();
    this.intrductionPopupContinueButton = this.frameLocator.locator(".continue-button");
    this.chatEndMessage1 = this.frameLocator.locator("//div[@class='chat-end-message-bg']/div/p");
    this.chatEndMessage2 = this.frameLocator.locator("//div[@class='chat-end-message-bg']/p");
    this.noOfAttemptChatPopup = this.frameLocator.locator("//div[@class='popup-header']/span");
  }

  public async launchActivity() {
    await this.page.goto("https://cengage-dho.zeuslearning.com/index.html?launchType=1&dho=dho2&attemptId=0");
  }

  public async runScenarioPathForLearnigMode(path: string[], testData: any) {
    let previousStep: string | null = null;

    for (let i = 0; i < path.length; i++) {
      const step = path[i];

      if (step === 'HINT') {
        console.log(`✅ Hint Opened — Last step was ${previousStep}`);
        await this.verifyPassedScenario();
        continue;
      }
      if (step === 'COMPLETE') {
        console.log(`✅ COMPLETE reached — Last step was ${previousStep}`);
        await this.verifyPassedScenario();
        break;
      }

      if (step === 'RESTART') {
        console.log(`🔁 Restarting challenge level — Last step was ${previousStep}`);
        await this.verifyFailedScenario(previousStep, testData);
        continue;
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
    if (selectedOptionID == "ch_01_12_opt_1") {
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);

      const replyText2 = actionDetails[actionKey + "_reply2"];
      const replyTextID2 = `${selectedOptionID}_rep_2`;
      await expect(this.frameLocator.locator(`//span[@id='${replyTextID2}']`)).toHaveText(replyText2);

      const replyMood2 = actionDetails[actionKey + "_reply_mood2"];
      const replyText3 = actionDetails[actionKey + "_reply3"];
      const replyTextID3 = `${selectedOptionID}_rep_3`;

      const replyMoodSelector2 = `//div[@id='${replyTextID3}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector2)).toHaveText("[" + replyMood2 + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID3}']`)).toHaveText(replyText3);

    } else if (selectedOptionID == "ch_02_11_opt_1") {
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);

      const replyText2 = actionDetails[actionKey + "_reply2"];
      const replyTextID2 = `${selectedOptionID}_rep_2`;
      await expect(this.frameLocator.locator(`//span[@id='${replyTextID2}']`)).toHaveText(replyText2);

    } else {
      // Get the reply mood and text for the selected action
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;

      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);
    }
  }

  private async verifyFailedScenario(previousStep: any, testData: any) {
    await expect(this.chatEndMessage1).toHaveText("This conversation has ended without a positive resolution.");
    await expect(this.chatEndMessage2).toHaveText("Select the Done button to proceed.");
    await this.clickOnDoneButton();
    const [level, rawAction] = previousStep.split("_");
    const actionMap: { [key: string]: string } = {
      INCORRECT: "incorrect",
      DISTRACTOR: "distractor"
    };

    const actionKey = actionMap[rawAction.toUpperCase()];
    const actionDetails = testData[level];
    const attemptEndingText = actionDetails[actionKey + "_attempt_ending_popup_text"];
    const feedbackPopupFirstText = "You’ve reached the end of your attempts, and the conversation did not lead to a successful resolution.  " + attemptEndingText;
    const feedbackPopupSecondText = "Select the Submit button to end the scenario and submit your results to your teacher.";

    // Verify text on popup for last incorrect attempt
    await expect(this.feedbackPopupText3).toHaveText(feedbackPopupFirstText);
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupSecondText);
    await this.clickOnSubmitButton();
  }


  private async verifyPassedScenario() {
    await expect(this.chatEndMessage1).toHaveText("This conversation has ended with a positive resolution.");
    await expect(this.chatEndMessage2).toHaveText("Select the Done button to proceed.");
    await this.clickOnDoneButton();

    // Verify text on popup
    const feedbackPopupFirstText = "Great job! You successfully navigated the conversation with empathy and patience, and demonstrated effective use of communication and problem solving skills to reach a positive outcome!";
    const feedbackPopupSecondText = "Select the Submit button to end the scenario and submit your results to your teacher.";

    // Verify text on popup for successful scenario
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    await this.clickOnSubmitButton();
  }

  private async verifyHintContent() {
    await expect(this.chatEndMessage1).toHaveText("This conversation has ended with a positive resolution.");
    await expect(this.chatEndMessage2).toHaveText("Select the Done button to proceed.");
    await this.clickOnDoneButton();

    // Verify text on popup
    const feedbackPopupFirstText = "Great job! You successfully navigated the conversation with empathy and patience, and demonstrated effective use of communication and problem solving skills to reach a positive outcome!";
    const feedbackPopupSecondText = "Select the Submit button to end the scenario and submit your results to your teacher.";

    // Verify text on popup for successful scenario
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    await this.clickOnContinueButton();
  }

  public async clickOnStartButton() {
    await this.page.waitForTimeout(55000);
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

    // Handle different level depths
    if (parts.length === 1) {
      // Level 1 (e.g., "C1" → "ch_01_opt_X")
      const mainSection = parts[0].padStart(2, "0");
      base = `ch_${mainSection}`;
    } else if (parts.length === 2) {
      // Level 2 (e.g., "C1.1" → "ch_01_11_opt_X", "C1.2" → "ch_01_12_opt_X")
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