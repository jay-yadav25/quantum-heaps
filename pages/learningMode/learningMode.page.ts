import { expect, Locator, FrameLocator, type Page } from '@playwright/test';

export class LearningMode {
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
  readonly continueButton: Locator;
  readonly hintButton: Locator;
  readonly timeTaken: Locator;
  readonly noOfHintUsed: Locator;
  readonly noOfAttemptUsed: Locator;

  readonly hintTitle: Locator;
  readonly emojiTitle: Locator;
  readonly emojiReaction: Locator;
  readonly suggestionTitle: Locator;
  readonly suggestionList: Locator;
  readonly suggestionListItems: Locator;
  readonly respondButton: Locator;

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
    this.respondButton = this.frameLocator.locator("//button[@id='respond-btn']").first();
    this.continueButton = this.frameLocator.locator("button#continue-btn");
    this.hintButton = this.frameLocator.locator("button#chat-hint-btn");

    this.hintTitle = this.frameLocator.locator("#dialog_label"); // hint title
    this.emojiTitle = this.frameLocator.locator("strong.emoji-title");
    this.emojiReaction = this.frameLocator.locator("div.emoji-reaction");
    this.suggestionTitle = this.frameLocator.locator("span.suggestion-title");
    this.suggestionList = this.frameLocator.locator("ul.suggestion-list");
    this.suggestionListItems = this.frameLocator.locator("ul.suggestion-list li");
    this.timeTaken = this.frameLocator.locator(" strong.time-value").first();
    this.noOfAttemptUsed = this.frameLocator.locator("strong.attempt-value").first();
    this.noOfHintUsed = this.frameLocator.locator("strong.hint-value").first();


  }
  private scenarioStartTime: number = 0;
  public async launchActivity() {
    await this.page.goto("https://dev-cengage-dho.zeuslearning.com/launcherPages/cengage_dho_launcher.html?launchType=1&dho=cs_l_02&attemptId=1");
  }

  public async runScenarioPathForLearnigMode(path: string[], testData: any) {
    let previousStep: string | null = null;
    await this.respondButton.click();
    for (let i = 0; i < path.length; i++) {
      const step = path[i];
      const nextStep = path[i + 1];

      if (step === 'HINT') {
        console.log(`✅ Hint Opened — Last step was ${previousStep}`);
        await this.verifyHintPopup(nextStep, testData);
        continue;
      }
      if (step === 'COMPLETE') {
        console.log(`✅ COMPLETE reached — Last step was ${previousStep}`);
        await this.verifyPassedScenario(path);
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
    if (selectedOptionID.startsWith("pa")) {
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);
      if (selectedOptionID != "pa_ch_01_opt_2") {
        const feedbackAlertText = actionDetails[actionKey + "_feedbackAlertText"];
        const feedbackAlertTextID = `${selectedOptionID}fb`;
        await expect(this.frameLocator.locator(`//span[@id='${feedbackAlertTextID}']`)).toHaveText(feedbackAlertText);
      }
      const replyText2 = actionDetails[actionKey + "_reply2"];
      const replyTextID2 = `${selectedOptionID}_rep_2`;
      await expect(this.frameLocator.locator(`//span[@id='${replyTextID2}']`)).toHaveText(replyText2);
      const defaultChat = testData["default_chat"]["Jay"];
      const defaultReply = testData["default_chat"]["Ricardo_Gonzalez"];
      const defaultMood = testData["default_chat"]["Ricardo_Gonzalez_reply_mood"];
      const defaultReplyMoodSelector = `//div[@id='ch_01_default_opt_1_rep_1']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;

      await expect(this.frameLocator.locator(`//span[@id='ch_01_default_opt_1']`)).toHaveText(defaultChat);
      await expect(this.frameLocator.locator(`//div[@id='ch_01_default_opt_1_rep_1']`)).toHaveText(defaultReply);
      await expect(this.frameLocator.locator(defaultReplyMoodSelector)).toHaveText("[" + defaultMood + "]");


    } else if (selectedOptionID.endsWith("opt_2") && (selectedOptionID === "ch_02_opt_2" || selectedOptionID === "ch_02_21_opt_2")) {
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);

      const replyText2 = actionDetails[actionKey + "_reply2"];
      const replyTextID2 = `${selectedOptionID}_rep_2`;
      await expect(this.frameLocator.locator(`//span[@id='${replyTextID2}']`)).toHaveText(replyText2);

      const replyMood3 = actionDetails[actionKey + "_reply_mood3"];
      const replyText3 = actionDetails[actionKey + "_reply3"];
      const replyTextID3 = `${selectedOptionID}_rep_3`;
      const replyMoodSelector2 = `//div[@id='${replyTextID3}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector2)).toHaveText("[" + replyMood3 + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID3}']`)).toHaveText(replyText3);
    } else if (selectedOptionID.endsWith("opt_2") && (selectedOptionID === "ch_01_opt_2" || selectedOptionID === "ch_01_12_opt_2" || selectedOptionID === "ch_01_11_opt_2")) {
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      await expect(this.frameLocator.locator(`//span[@id='${replyTextID}']`)).toHaveText(replyText);

      const replyMood2 = actionDetails[actionKey + "_reply_mood2"];
      const replyText2 = actionDetails[actionKey + "_reply2"];
      const replyTextID1 = `${selectedOptionID}_rep_2`;
      const replyMoodSelector = `//div[@id='${replyTextID1}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood2 + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID1}']`)).toHaveText(replyText2);
    } else if (selectedOptionID.endsWith("opt_2")) {
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);
    } else {
      const replyMood = actionDetails[actionKey + "_reply_mood"];
      const replyText = actionDetails[actionKey + "_reply"];
      const replyTextID = `${selectedOptionID}_rep_1`;
      const replyMoodSelector = `//div[@id='${replyTextID}']/parent::div/preceding-sibling::div/span[contains(@class, "patient-reaction")]`;
      await expect(this.frameLocator.locator(replyMoodSelector)).toHaveText("[" + replyMood + "]");
      await expect(this.frameLocator.locator(`//div[@id='${replyTextID}']`)).toHaveText(replyText);

      const feedbackAlertText = actionDetails[actionKey + "_feedbackAlertText"];
      const feedbackAlertTextID = `${selectedOptionID}fb`;
      await expect(this.frameLocator.locator(`//span[@id='${feedbackAlertTextID}']`)).toHaveText(feedbackAlertText);
    }
  }

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
    const feedbackPopupFirstText = "The conversation path you took did not lead to a positive resolution.  " + attemptEndingText;
    const feedbackPopupSecondText = "Continue practicing your problem-solving and communication skills by retrying the scenario once again.";

    // Verify text on popup for last incorrect attempt
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    await this.clickOnRetryButton();
    await this.respondButton.click();
  }


  private async verifyPassedScenario(path: string[]) {
    // Your existing verification
    await expect(this.chatEndMessage1).toHaveText("This conversation has ended with a positive resolution.");
    //await expect(this.chatEndMessage2).toHaveText("Select the Summary button to view your conversation summary.");
    await expect(this.chatEndMessage2).toHaveText("Select the Submit button to submit your results to your teacher.");
    // Click done button and calculate time taken
    await this.clickOnDoneButton();
    const actualTimeTaken = performance.now() - this.scenarioStartTime;

    // Verify popup content
    const feedbackPopupFirstText = "Great job! You successfully navigated the conversation with patience, tact, and competence. You demonstrated effective use of communication and problem solving skills to reach a positive outcome!";
    //await this.page.pause();
    await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);

    // Compare actual time with displayed time
    const displayedTime = await this.timeTaken.innerText();
    const expectedSeconds = Math.round(actualTimeTaken / 1000);

    console.log(`Total scenario time: ${actualTimeTaken}ms (${expectedSeconds}s)`);
    console.log(`Displayed time: ${displayedTime}`);

    // Parse displayed time and verify
    const displayedSeconds = this.parseDisplayedTime(displayedTime);

    //Verify timing matches (with tolerance of ±2 seconds for UI delays)
    expect(displayedSeconds).toBeGreaterThanOrEqual(expectedSeconds - 2);
    expect(displayedSeconds).toBeLessThanOrEqual(expectedSeconds + 2);

    // Path analysis  
    const pathAnalysis = this.analyzePath(path);
    await expect(this.noOfAttemptUsed).toHaveText(`${pathAnalysis.restartCount}`);
    await expect(this.noOfHintUsed).toHaveText(`${pathAnalysis.hintCount}`);

    // Return the actual time taken for further use if needed
    return actualTimeTaken;
  }

  private parseDisplayedTime(displayedTime: string): number {
    if (!displayedTime) return 0;

    // Handle format like "00 min 45 sec" or "01 min 30 sec"
    const minMatch = displayedTime.match(/(\d+)\s*min/);
    const secMatch = displayedTime.match(/(\d+)\s*sec/);

    const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
    const seconds = secMatch ? parseInt(secMatch[1], 10) : 0;

    return (minutes * 60) + seconds;
  }

  private analyzePath(path: string[]): { hintCount: number; restartCount: number; totalActions: number } {
    const hintCount = path.filter(action => action.toUpperCase().includes('HINT')).length;
    const noOFRestart = path.filter(action => action.toUpperCase().includes('RESTART')).length;
    const restartCount = noOFRestart + 1;
    return {
      hintCount,
      restartCount,
      totalActions: path.length
    };
  }

  private async verifyHintPopup(nextStep: string, testData: any) {
    await this.clickOnHintButton();
    const [level, rawAction] = nextStep.split("_");
    const actionDetails = testData[level];
    console.log(nextStep);
    // Access the hint popup data correctly
    const hintPopup = actionDetails.hint_popup;
    const hintBody = hintPopup.body;

    // Verify hint title
    await expect(this.hintTitle).toHaveText(hintPopup.title);

    // Access emoji and text from left_side_content
    await expect(this.emojiTitle).toHaveText(hintBody.left_side_content.text1);
    await expect(this.emojiReaction).toHaveText(hintBody.left_side_content.text2);

    // Access suggestion list items
    const suggestionItems = hintBody.suggestionListItems;
    await expect(this.suggestionTitle).toHaveText(suggestionItems[0]);
    const objectiveItems = await this.suggestionListItems.all();
    expect(objectiveItems.length).toBe(suggestionItems.length - 1);

    // Loop through all suggestion items (starting from 1)
    for (let i = 1; i < objectiveItems.length; i++) {
      await expect(objectiveItems[i - 1]).toHaveText(suggestionItems[i]);
    }
    await this.clickOnContinueButton();
  }

  public async clickOnStartButton() {
    await this.page.waitForTimeout(55000);
    await this.startButton.click();
    await this.intrductionPopupContinueButton.click();
  }
  public async clickOnContinueButton() {
    await this.continueButton.click();
  }

  public async typeInInputText(text: string) {
    await this.inputField.fill(text);
  }

  public async clickOnAvatarSelectionDone() {
    this.scenarioStartTime = performance.now();
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

  public async clickOnHintButton() {
    await this.hintButton.click();
  }

  private async getOptionIds(level: string) {
    // Remove the "C" prefix and split by "."
    const parts = level.replace("C", "").split(".");

    let base: string;
    if (level === "PA") {
      base = `pa_ch_01`;
    } else {
      // Handle different level depths
      if (parts.length === 1) {
        // Level 1 (e.g., "C1" → "ch_01_opt_X")
        const mainSection = parts[0].padStart(2, "0");
        base = `ch_${mainSection}`;
      } else if (parts.length === 2) {
        // e.g., "C1.1" → "ch_01_11", "C2.1" → "ch_02_21"
        const mainSection = parts[0].padStart(2, "0");
        base = `ch_${mainSection}_${parts[0]}${parts[1]}`;
      }
      else {
        throw new Error(`Unsupported level format: ${level}`);
      }
    }


    return {
      distractorOptionID: `${base}_opt_1`,
      correctOptionID: `${base}_opt_2`,
      incorrectOptionID: `${base}_opt_3`
    };
  }
}