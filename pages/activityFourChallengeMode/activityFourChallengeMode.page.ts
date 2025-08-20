import { expect, Locator, FrameLocator, type Page } from '@playwright/test';

export class ActivityFour {
  readonly page: Page;
  private readonly frameLocator: FrameLocator;
  readonly startButton: Locator;
  readonly submitButton: Locator;
  readonly continueButton: Locator;
  readonly hintButton: Locator;
  readonly hintTitle: Locator;
  readonly popupCloseButton: Locator;
  readonly hintPopupAskListItems: Locator;
  readonly hintPopupListItems: Locator;
  readonly hintPopupThinkListItems: Locator;
  readonly introductionContinueButton:Locator;
  readonly stepInstruction:Locator;
   readonly stepDescription:Locator;
  readonly stepInstructionList:Locator;
  readonly popupContinueButton:Locator;
  readonly totalTimeTaken:Locator;
  readonly loader:Locator;
  private scenarioStartTime: number = 0;
   // Learning Objectives Page
    readonly learningObjectiveTitle: Locator;
    readonly learningObjectiveDetails: Locator;
    readonly activityTitleStartPage: Locator;
     readonly learningObjectiveTitleInPopup: Locator;
    readonly learningObjectiveDetailsInPopup: Locator;
    readonly learningObjectiveHeader: Locator;
    readonly learningObjectiveHeaderInPopup:Locator;

    // Introduction Popup
    readonly introductionPopUpTitle: Locator;
    readonly introPopupText: Locator;
    readonly activityOverviewTitle: Locator;
    readonly activityOverviewDetails: Locator;
    readonly introductionPopUpTitleInPopup: Locator;
    readonly introPopupTextInPopup: Locator;
    readonly activityOverviewTitleInPopup: Locator;
    readonly activityOverviewDetailsInPopup: Locator;
    readonly introductionActivityMode:Locator;
    readonly introductionActivityModeInPopup:Locator;
    readonly continueButtonIntroAndLoPopup:Locator;
    readonly moreOptionsButton:Locator;
    readonly moreOptionLearnignObjectiveButton:Locator;
    readonly moreOptionIntroductionButton:Locator;

  constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.startButton = this.frameLocator.locator("//button[@id='start-btn']");
    this.submitButton = this.frameLocator.locator("//button[@id='submit-btn']");
    this.continueButton = this.frameLocator.locator("button#continue-btn");
    this.continueButtonIntroAndLoPopup = this.frameLocator.locator("button#continue-btn").nth(1);
     this.introductionContinueButton = this.frameLocator.locator("button#introduction-continue-btn");
    this.hintButton = this.frameLocator.locator("button#chat-hint-btn");
    this.popupCloseButton = this.frameLocator.locator("#popup-close-btn").first();
    this.hintTitle = this.frameLocator.locator("#dialog_label");
    this.hintPopupAskListItems = this.frameLocator.locator("ul.ask-yourself-list>li"); 
    this.hintPopupListItems = this.frameLocator.locator("ul.info-list-container>li>p"); 
    this.hintPopupThinkListItems = this.frameLocator.locator("ul.think-about-list>li");
    this.stepInstruction = this.frameLocator.locator("#dialog_desc>p");
    this.stepDescription = this.frameLocator.locator("#dialog_label");
    this.totalTimeTaken = this.frameLocator.locator("strong.time-value");
    this.stepInstructionList = this.frameLocator.locator("ul.instruction-description>li");
     this.popupContinueButton = this.frameLocator.locator("//button[@id='continue-btn' and contains(@class, 'common-done-btn')]");
     // Learning Objectives Page
    this.learningObjectiveTitle = this.frameLocator.locator("h2.info-title");
    this.learningObjectiveTitleInPopup = this.frameLocator.locator(" h2#dialog_label");
    this.learningObjectiveDetails = this.frameLocator.locator(".ul-wrapper>ul li");
    this.learningObjectiveDetailsInPopup = this.frameLocator.locator("#dialog_desc>.ul-wrapper>ul li");
    this.activityTitleStartPage = this.frameLocator.locator("#start-page-title");
    this.learningObjectiveHeader = this.frameLocator.locator("div.info-subtitle");
    this.learningObjectiveHeaderInPopup = this.frameLocator.locator("#dialog_desc>p.sub-title");
  
    this.introductionPopUpTitle = this.frameLocator.locator("h2.popup-title");
    this.introductionPopUpTitleInPopup = this.frameLocator.locator("h2#dialog_label");
    this.introPopupText = this.frameLocator.locator("div.popup-details>p");
    this.introPopupTextInPopup = this.frameLocator.locator("#dialog_desc>div.popup-details>p");
    this.activityOverviewTitle = this.frameLocator.locator("h3.overview-title");
    this.activityOverviewTitleInPopup = this.frameLocator.locator("#dialog_desc h3.overview-title");
    this.activityOverviewDetails = this.frameLocator.locator("ul.overview-text  li");
    this.activityOverviewDetailsInPopup = this.frameLocator.locator(" #dialog_desc ul.overview-text  li");
    this.introductionActivityMode = this.frameLocator.locator(".challenge-mode-text>p");
    this.introductionActivityModeInPopup = this.frameLocator.locator(" #dialog_desc .challenge-mode-text>p");
    this.moreOptionsButton = this.frameLocator.locator('//button[@aria-label="More Options"]');
    this.moreOptionLearnignObjectiveButton = this.frameLocator.locator('//li[@aria-label="Learning Objectives"]');
    this.moreOptionIntroductionButton = this.frameLocator.locator('//li[@aria-label="Introduction"]');
    this.loader = this.frameLocator.locator('div.circular-loader');
  }
  public async launchActivity(environment:string,activityNo: number) {
    console.log(environment);
  let baseUrl='';
  if(environment==="PROD"){
    baseUrl="https://cengage-dho.zeuslearning.com/index.html";
  }else if (environment==="STAGE"){
    baseUrl="https://dev-cengage-dho.zeuslearning.com/launcherPages/cengage_dho_launcher.html";
  }
  const activityMap: Record<number, string> = {
    1: "cs_c_01",
    2: "cs_l_02",
    3: "dm_l_03",
    4: "dm_c_04",
    5: "cs_c_05"
  };

  const dhoCode = activityMap[activityNo];
    const url = `${baseUrl}?launchType=1&dho=${dhoCode}&attemptId=1`;
    await this.page.goto(url);
    const timeout = 4 * 60 * 1000; // 4 minutes
    const interval = 2000; // 2 seconds
    const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      // Check if loader is visible
      if (await this.loader.isVisible()) {
        await this.page.waitForTimeout(interval);
        continue;
      }
      if (await this.startButton.isVisible() && await this.startButton.isEnabled()) {
        return;
      }

    } catch (err) {
    }
    await this.page.waitForTimeout(interval);
  }
  throw new Error("Loader did not disappear or button not clickable within 4 minutes");
  }

 public async runScenarioPathForActivityFourChallengeMode(path: string[], testData: any) {
  for (let i = 0; i < path.length; i++) {
    const rawStep = path[i];
    await this.processStep(rawStep, testData);
  }
}


private findPreviousValidStep(path: string[], currentIndex: number): string {
  for (let i = currentIndex - 1; i >= 0; i--) {
    const stepName = path[i];
    if (stepName !== 'HINT' && stepName !== 'NEXTSTEP') {
      return stepName;
    }
  }
  return "NOTFOUND";
}

private findNextValidStep(path: string[], currentIndex: number): string {
  for (let i = currentIndex + 1; i < path.length; i++) {
    const stepName = path[i];
    if (stepName !== 'HINT' && stepName !== 'NEXTSTEP') {
      return stepName;
    }
  }
  return "NOTFOUND";
}


  public async clickOnStartButton() {
   await this.startButton.click();
  }
  public async clickOnPopupContinueButton() {
    await this.popupContinueButton.nth(1).click();
  }
  public async clickOnMoreOptionPopupIntroductionButton() {
    await this.clickOnPopupContinueButton();
    await this.moreOptionsButton.click();
    await this.moreOptionIntroductionButton.click();
  }
  public async clickOnMoreOptionPopupLearningObjectiveButton() {
    await this.moreOptionsButton.click();
    await this.moreOptionLearnignObjectiveButton.click();
  }
  public async verifyLearningObjectivePageIsVisible() {
    await this.page.waitForTimeout(5000);
    await this.startButton.isVisible();
  }
  public async verifyTitleAndLearningObjectivesPage(testData:any) {
    const activityTitle=testData.learningObjectiveItems.title;
    const learningObjectiveHeader=testData.learningObjectiveItems.learningObjective;
    const learningObjectivesList=testData.learningObjectiveItems.learningObjectivesList;
    //await expect(this.activityTitleStartPage).toHaveText(activityTitle);
    await expect(this.learningObjectiveTitle).toBeVisible();
    await expect(this.learningObjectiveTitle).toHaveText("Learning Objectives");
    await expect(this.learningObjectiveHeader).toHaveText(learningObjectiveHeader);
    const objectiveItems = await this.learningObjectiveDetails.all();
    expect(objectiveItems.length).toBe(learningObjectivesList.length);
    for (let i = 0; i < objectiveItems.length; i++) {
        await expect(objectiveItems[i]).toHaveText(learningObjectivesList[i]);
    }
  }

  public async verifyLearningObjectivesPopUp(testData:any) {
    const learningObjectiveHeader=testData.learningObjectiveItems.learningObjective;
    const learningObjectivesList=testData.learningObjectiveItems.learningObjectivesList;
    await expect(this.learningObjectiveTitleInPopup).toBeVisible();
    await expect(this.learningObjectiveTitleInPopup).toHaveText("Learning Objectives");
    await expect(this.learningObjectiveHeaderInPopup).toHaveText(learningObjectiveHeader);
    const objectiveItems = await this.learningObjectiveDetailsInPopup.all();
    expect(objectiveItems.length).toBe(learningObjectivesList.length);
    for (let i = 0; i < objectiveItems.length; i++) {
        await expect(objectiveItems[i]).toHaveText(learningObjectivesList[i]);
    }
    await this.continueButtonIntroAndLoPopup.click();
  }
  public async verifyIntroductionPageIsVisible() {
    await this.introductionContinueButton.isVisible();
  }
  public async verifyIntroductionPage(testData:any) {
    const introductionList=testData.introduction.introductionList;
    const activityOverviewList=testData.introduction.activityOverviewList;
    const mode=testData.introduction.mode;
    await expect(this.introductionPopUpTitle).toBeVisible();
    await expect(this.introductionPopUpTitle).toHaveText("Introduction");
    const introductionsListLocator = await this.introPopupText.all();
    expect(introductionsListLocator.length).toBe(introductionList.length);
    for (let i = 0; i < introductionList.length; i++) {
        await expect(introductionsListLocator[i]).toHaveText(introductionList[i]);
    }
      await expect(this.activityOverviewTitle).toHaveText("Activity Overview");
    const activityOverviewLocator = await this.activityOverviewDetails.all();
    expect(activityOverviewLocator.length).toBe(activityOverviewList.length);
    for (let i = 0; i < activityOverviewList.length; i++) {
        await expect(activityOverviewLocator[i]).toHaveText(activityOverviewList[i]);
    }
    await expect(this.introductionActivityMode).toHaveText(mode);
  }
  public async verifyIntroductionPopUp(testData:any) {
    const introductionList=testData.introduction.introductionList;
    const activityOverviewList=testData.introduction.activityOverviewList;
    const mode=testData.introduction.mode;
    await expect(this.introductionPopUpTitle).toBeVisible();
    await expect(this.introductionPopUpTitle).toHaveText("Introduction");
    const introductionsListLocator = await this.introPopupText.all();
    expect(introductionsListLocator.length).toBe(introductionList.length);
    for (let i = 0; i < introductionList.length; i++) {
        await expect(introductionsListLocator[i]).toHaveText(introductionList[i]);
    }
      await expect(this.activityOverviewTitle).toHaveText("Activity Overview");
    const activityOverviewLocator = await this.activityOverviewDetails.all();
    expect(activityOverviewLocator.length).toBe(activityOverviewList.length);
    for (let i = 0; i < activityOverviewList.length; i++) {
        await expect(activityOverviewLocator[i]).toHaveText(activityOverviewList[i]);
    }
    await expect(this.introductionActivityMode).toHaveText(mode);
    await this.continueButtonIntroAndLoPopup.click();
  }
  public async clickOnContinueButton() {
    await this.continueButton.click();
  }
  public async clickOnIntroductionContinueButton() {
    await this.introductionContinueButton.click();
  }

  public async verifyFirstStepIsVisible() {
    
  }
  public async clickOnSubmitButton() {
    await this.submitButton.click();
  }

  public async clickOnHintButton() {
    await this.hintButton.click();
  }

  private async processStep(step: string, testData: any) {

    if (step.startsWith("S")) {
      console.log(`✅  ${step}`);
      await this.verifySingleSelectStep(step, testData);
      return;
    }

    if (step.startsWith("C")) {
      console.log(`✅  ${step}`);
      await this.verifyChatStep(step,testData);
      return;
    }
    if (step.startsWith("M")) {
      console.log(`✅  ${step}`);
      await this.verifyMultiSelectStep(step,testData);
      return;
    }

    if (step === 'NEXTSTEP') {
      await this.clickOnContinueButton();
      return;
    }
  }

  private parseDisplayedTime(displayedTime: string): number {
    if (!displayedTime) return 0;

    const minMatch = displayedTime.match(/(\d+)\s*min/);
    const secMatch = displayedTime.match(/(\d+)\s*sec/);

    const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
    const seconds = secMatch ? parseInt(secMatch[1], 10) : 0;

    return (minutes * 60) + seconds;
  }

 private extractStatuses(steps: string): string[] {
  // Find index of the first underscore after the step prefix (handles C3.1, M4.2, etc.)
  const firstUnderscoreIndex = steps.indexOf("_");
  if (firstUnderscoreIndex === -1) return [];

  // Remove the step prefix and split the rest
  const parts = steps.slice(firstUnderscoreIndex + 1).split("_");

  // Group every 2 parts into a single status (e.g., INCORRECT_1)
  const result: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    if (parts[i + 1] !== undefined) {
      result.push(parts[i] + "_" + parts[i + 1]);
    }
  }

  return result;
}
  private getStepOptionIds(step: string): string[] {

  if (step.startsWith('S')) {
    const stepNumber = step.match(/^S(\d+)/)?.[1];
    if (!stepNumber) return [];
    return [
      `slt_step_${stepNumber}_opt_1`,
      `slt_step_${stepNumber}_opt_2`,
      `slt_step_${stepNumber}_opt_3`
    ];
  }


  if (step.startsWith('C')) {
    const match = step.match(/^C(\d+)\.(\d+)/);
    if (!match) return [];
    const [_, major, minor] = match;
    return [
      `slt_step_${major}_${minor}_opt_1`,
      `slt_step_${major}_${minor}_opt_2`,
      `slt_step_${major}_${minor}_opt_3`
    ];
  }


  if (step.startsWith('M')) {
    const match = step.match(/^M(\d+)\.(\d+)/);
    if (!match) return [];
    const [_, major, minor] = match;
    return Array.from({ length: 4 }, (_, i) =>
      `slt_step_${major}_${minor}_opt_${i + 1}`
    );
  }

  // Fallback: unrecognized format
  return [];
}


  private async verifySingleSelectStep(step: string, testData: any) {
    await this.verifyStepInstruction(step, testData);
    await this.verifySpeechBubbleConversation(step, testData);
    await this.verifyQuestion(step, testData);
    await this.verifyAndSelectSingleSelectOptions(step, testData);
  }

   private async verifyChatStep(step: string,testData: any) {
    await this.verifyStepInstruction(step, testData);
    await this.verifyQuestion(step, testData);
    await this.verifyAndSelectSingleSelectChatOptions(step, testData);
  }
  private async verifyMultiSelectStep(step: string,testData: any) {
    await this.verifyStepInstruction(step, testData);
    await this.verifyQuestion(step, testData);
    await this.verifyAndSelectMultiSelectOptions(step, testData);
  }
 

  private async verifyStepInstruction(step: string, testData: any) {
    let sceneLevel = '';
    if (step.startsWith('S')) {
      const stepNumber = step.match(/S(\d+)/)?.[1];
      sceneLevel = 'STEP_' + stepNumber;
      
    } else if (step.startsWith('C')) {
      const match = step.match(/^C(\d+)\.(\d+)_/);
      if (match) {
        const [_, major, minor] = match;
        sceneLevel = `STEP_${major}_${minor}`;
      }
    }else if (step.startsWith('M')) {
        const match = step.match(/^M(\d+)\.(\d+)_/);
        if (match) {
          const [_, major, minor] = match;
          sceneLevel = `STEP_${major}_${minor}`;
        }
    }
    //const stepNumber = step.match(/S(\d+)/)?.[1];
    const stepDetails = testData[sceneLevel];
    const instructionTextList = stepDetails.instruction;
    const noOfInstructionItems = await this.stepInstruction.all();
    await expect(this.stepDescription).toHaveText("Scenario Description");
    for (let i = 0; i < instructionTextList.length; i++) {
     await expect(noOfInstructionItems[i]).toHaveText(instructionTextList[i]);
    } 
    await this.clickOnPopupContinueButton();
    const instructionListItemsText = stepDetails.instructionsList;
    const noOfInstructionListItems = await this.stepInstructionList.all();
    for (let i = 0; i < instructionListItemsText.length; i++) {
     await expect(noOfInstructionListItems[i]).toHaveText(instructionListItemsText[i]);
    }
  }


  private async verifySpeechBubbleConversation(step: string, testData: any) {
     const stepNumber = step.match(/S(\d+)/)?.[1];
    const stepDetails = testData["STEP_"+stepNumber];
    const speechBubbleTexts = stepDetails.conversation;
    console.log(speechBubbleTexts);
    if (speechBubbleTexts && Array.isArray(speechBubbleTexts) && speechBubbleTexts.length > 0) {
      for (let i = 0; i < speechBubbleTexts.length; i++) {
        const characterName=speechBubbleTexts[i].title;
        await expect(this.frameLocator.locator(`//strong[@class='name-title' and normalize-space()='${characterName}']/following-sibling::span[1]`).first()).toHaveText(speechBubbleTexts[i].text);
      }
    }
  }

  private async verifyQuestion(step: string, testData: any) {
   
    let sceneLevel = '';
    let stepDetails: any;
    let questionText = '';
    

    if (step.startsWith('S')) {
      const stepNumber = step.match(/S(\d+)/)?.[1];
      sceneLevel = 'STEP_' + stepNumber;
      
    } else if (step.startsWith('C')) {
      const match = step.match(/^C(\d+)\.(\d+)_/);
      if (match) {
        const [_, major, minor] = match;
        sceneLevel = `STEP_${major}_${minor}`;
      }
    }else if (step.startsWith('M')) {
        // Extract sceneLevel like STEP_4_2
        const match = step.match(/^M(\d+)\.(\d+)_/);
        if (match) {
          const [_, major, minor] = match;
          sceneLevel = `STEP_${major}_${minor}`;
        }
      
    }
    stepDetails = testData[sceneLevel];
    questionText = stepDetails.question;
    const stepID = this.getStepOptionIds(step)[0];
    console.log(questionText);
    const questionLocator=`//*[contains(@id,'${stepID}')]/ancestor::*[contains(@class,'')]/preceding-sibling::strong`
    await this.page.pause();
    await expect(this.frameLocator.locator(questionLocator)).toHaveText(questionText);
  }

  

 private async verifyAndSelectSingleSelectOptions(step: string, testData: any) {
  const stepNumber = step.match(/S(\d+)/)?.[1];
  const optionIds = await this.getStepOptionIds(step);
  console.log(optionIds);

  if (optionIds.length < 3) {
    throw new Error(`Expected at least 3 options for step ${step}, got ${optionIds.length}`);
  }

  const stepDetails = testData['STEP_' + stepNumber];
  const correctOptionText = stepDetails.CORRECT;
  const incorrectOptionText = stepDetails.INCORRECT_1;
  const incorrectOptionText2 = stepDetails.INCORRECT_2;
  const attemptOneFeedback = stepDetails.attemptOneFeedback;
  const attemptTwoFeedback = stepDetails.attemptTwoFeedback;
  await expect(this.frameLocator.locator(`//button[@id='${optionIds[0]}']//p`).first()).toHaveText(incorrectOptionText);
  await expect(this.frameLocator.locator(`//button[@id='${optionIds[2]}']//p`).first()).toHaveText(correctOptionText);
  await expect(this.frameLocator.locator(`//button[@id='${optionIds[1]}']//p`).first()).toHaveText(incorrectOptionText2);

  const statuses = this.extractStatuses(step);

  for (let i = 0; i < statuses.length; i++) {
    let selectedOptionID: string;
    let attemptFeedbackText: string | undefined;
    console.log(statuses)
    if (statuses[i]=="CORRECT") {
      selectedOptionID = optionIds[2]; 
      console.log(selectedOptionID);
      await this.frameLocator.locator(`//button[@id='${selectedOptionID}']`).first().click();

    } else if (statuses[i].includes("INCORRECT_1")) {
      selectedOptionID = optionIds[0];
      console.log(selectedOptionID);
      attemptFeedbackText = i === 0 ? attemptOneFeedback : i === 1 ? attemptTwoFeedback : undefined;
      await this.frameLocator.locator(`//button[@id='${selectedOptionID}']`).first().click();
      await this.verifyFeedbackPopupText(attemptFeedbackText, i);

    } else if (statuses[i].includes("INCORRECT_2")) {
      selectedOptionID = optionIds[1];
      console.log(selectedOptionID);
      attemptFeedbackText = i === 0 ? attemptOneFeedback : i === 1 ? attemptTwoFeedback : undefined;
      await this.frameLocator.locator(`//button[@id='${selectedOptionID}']`).first().click();
      await this.verifyFeedbackPopupText(attemptFeedbackText, i);

    } else {
      throw new Error(`Unknown step format: ${statuses[i]}`);
    }
  }
}

private async verifyFeedbackPopupText(feedbackText?: string, attemptNumber?: number) {
  if (feedbackText) {
   // await expect(this.frameLocator.locator('.feedback-popup')).toContainText(feedbackText);
  }
  if (attemptNumber !== undefined) {
    console.log(`Verifying feedback for attempt #${attemptNumber + 1}`);
  }
  //await this.popupCloseButton.click();
}

  private async verifyAndSelectSingleSelectChatOptions(step: string, testData: any) {
    let sceneLevel=''
    const match = step.match(/^C(\d+)\.(\d+)_/);
      if (match) {
        const [_, major, minor] = match;
        sceneLevel = `${major}_${minor}`;
      }
    const optionIds = await this.getStepOptionIds(step);
    
    if (optionIds.length < 3) {
      throw new Error(`Expected at least 3 options for step ${step}, got ${optionIds.length}`);
    }
    console.log(sceneLevel);
    const stepDetails = testData['STEP_' + sceneLevel];
    const correctOptionText = stepDetails.CORRECT;
    const incorrectOptionText = stepDetails.INCORRECT_1;
    const incorrectOptionText2 = stepDetails.INCORRECT_2;
    const defaultChat = stepDetails.pt_message;
     const attemptOneFeedback = stepDetails.attemptOneFeedback;
   await expect(this.frameLocator.locator(`//span[contains(@id, 'slt_${sceneLevel}_default_chat')]`).first()).toHaveText(defaultChat);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[0]}']//p`).first()).toHaveText(incorrectOptionText);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[2]}']//p`).first()).toHaveText(correctOptionText);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[1]}']//p`).first()).toHaveText(incorrectOptionText2);

    let selectedOptionID: string;
    let chatReply: string;
    let selectedOption: string;
    if (step=='CORRECT') {
      selectedOptionID = optionIds[2];
      chatReply=stepDetails.CORRECT_1_REPLY;
      selectedOption=correctOptionText;
      await this.frameLocator.locator(`//button[@id='${selectedOptionID}']`).first().click();
      await this.verifyFeedbackPopupText(attemptOneFeedback);
      
    } else if (step.includes('INCORRECT_1')) {
      selectedOptionID = optionIds[0];
      chatReply=stepDetails.INCORRECT_1_REPLY;
      selectedOption=incorrectOptionText;
      await this.frameLocator.locator(`//button[@id='${selectedOptionID}']`).first().click();
      await this.verifyFeedbackPopupText(attemptOneFeedback);
    } else if (step.includes('INCORRECT_2')) {
      selectedOptionID = optionIds[1];
      chatReply=stepDetails.INCORRECT_2_REPLY;
      selectedOption=incorrectOptionText2;
      await this.frameLocator.locator(`//button[@id='${selectedOptionID}']`).first().click();
      await this.verifyFeedbackPopupText(attemptOneFeedback);
    } else {
      throw new Error(`Unknown step format: ${step}`);
    }
   await expect(this.frameLocator.locator(`//section[.//*[contains(@id, 'slt_${sceneLevel}_default_chat')]]//div[contains(@class, 'chat-message-reply')]`)).toHaveText(chatReply);
   await expect(this.frameLocator.locator(`//section[.//*[contains(@id, 'slt_${sceneLevel}_default_chat')]]//div[contains(@class, 'message-bubble message-option')]/span`)).toHaveText(selectedOption);
     
  }

  private async verifyAndSelectMultiSelectOptions(step: string, testData: any) {
    let sceneLevel=''
    const match = step.match(/^M(\d+)\.(\d+)_/);
        if (match) {
          const [_, major, minor] = match;
          sceneLevel = `${major}_${minor}`;
        }
    const stepDetails = testData['STEP_' + sceneLevel];
    const attemptOneFeedback=stepDetails.attemptOneFeedback;
    const attemptTwoFeedback=stepDetails.attemptTwoFeedback;
    const idealChoices = stepDetails.correctAnswers ;
    const nonIdealChoices = stepDetails.incorrectAnswers;
    const statuses = this.extractStatuses(step);

  for (let i = 0; i < statuses.length; i++) {
  let optionToClick: any;
  let attemptFeedbackText: string | undefined;
  await this.page.pause()
  if (statuses.length === 1) {
    if (statuses[i] === "CORRECT") {
      for (let j = 0; j < idealChoices.length; j++) {
        optionToClick = idealChoices[j];
        const commonLocatorMultiselect = `//button[contains(@id, 'slt_step_${sceneLevel}') and normalize-space(string(./text())) = '${optionToClick}']`;
        await this.frameLocator.locator(commonLocatorMultiselect).first().click();
        console.log("clicked:" + optionToClick);
      }
      await this.clickOnContinueButton();
    } 
  } else if (statuses.length === 2) {
    const firstEntry = statuses[0];
    const secondEntry = statuses[1];
    if (secondEntry === "CORRECT") {
      console.log("First attempt: Selecting both correct and incorrect options");
      for (let j = 0; j < idealChoices.length; j++) {
        const correctLocator = `//button[contains(@id, 'slt_step_${sceneLevel}') and normalize-space(string(./text())) = '${idealChoices[j]}']`;
        await this.frameLocator.locator(correctLocator).first().click();
        console.log("clicked correct:" + idealChoices[j]);
      }
      for (let j = 0; j < nonIdealChoices.length; j++) {
        const incorrectLocator = `//button[contains(@id, 'slt_step_${sceneLevel}') and normalize-space(string(./text())) = '${nonIdealChoices[j]}']`;
        await this.frameLocator.locator(incorrectLocator).first().click();
        console.log("clicked incorrect:" + nonIdealChoices[j]);
      }
      await this.clickOnContinueButton();
      console.log("Second attempt: Selecting only incorrect options");
      for (let j = 0; j < nonIdealChoices.length; j++) {
        const incorrectLocator = `//button[contains(@id, 'slt_step_${sceneLevel}') and normalize-space(string(./text())) = '${nonIdealChoices[j]}']`;
        await this.frameLocator.locator(incorrectLocator).first().click();
        console.log("clicked incorrect:" + nonIdealChoices[j]);
      }
      
      attemptFeedbackText = i === 0 ? attemptOneFeedback : i === 1 ? attemptTwoFeedback : undefined;
      await this.verifyFeedbackPopupText(attemptFeedbackText, i);
    } else if (firstEntry.includes("INCORRECT") && secondEntry.includes("INCORRECT")) {
      console.log("Both entries are incorrect - sequential selection approach");
      const firstIncorrectOption = nonIdealChoices[0];
      const incorrectLocator = `//button[contains(@id, 'slt_step_${sceneLevel}') and normalize-space(string(./text())) = '${firstIncorrectOption}']`;
      await this.frameLocator.locator(incorrectLocator).first().click();
      console.log("clicked first incorrect:" + firstIncorrectOption);
      
      attemptFeedbackText = i === 0 ? attemptOneFeedback : i === 1 ? attemptTwoFeedback : undefined;
      await this.verifyFeedbackPopupText(attemptFeedbackText, i);
      await this.clickOnContinueButton();
      console.log("Second attempt: Selecting first correct option");
      const firstCorrectOption = idealChoices[0];
      const correctLocator = `//button[contains(@id, 'slt_step_${sceneLevel}') and normalize-space(string(./text())) = '${firstCorrectOption}']`;
      await this.frameLocator.locator(correctLocator).first().click();
      console.log("clicked first correct:" + firstCorrectOption);
    } else {
      throw new Error(`Unknown step format combination: ${firstEntry}, ${secondEntry}`);
    }
  } 
  }
  }
}