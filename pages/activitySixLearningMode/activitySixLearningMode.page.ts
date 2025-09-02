import { expect, Locator, FrameLocator, type Page } from '@playwright/test';

export class ActivitySix {
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
    readonly restartButton:Locator;

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
    this.restartButton=this.frameLocator.locator('#restart-btn');
  }

 public async runScenarioPathForActivitySixLearningMode(path: string[], testData: any) {
  for (let i = 0; i < path.length; i++) {
    const rawStep = path[i];
    const nextValidStep = this.findNextValidStep(path, i);
    await this.processStep(rawStep, nextValidStep,testData);
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
    await expect(this.introductionPopUpTitleInPopup).toBeVisible();
    await expect(this.introductionPopUpTitleInPopup).toHaveText("Introduction");
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

  // private async processStep(step: string, testData: any) {

  //   if ((step.startsWith("S") && step !="SUBMIT")) {
  //     console.log(`✅  ${step}`);
  //     await this.verifySingleSelectStep(step, testData);
  //     return;
  //   }

  //   if (step.startsWith("C")) {
  //     console.log(`✅  ${step}`);
  //     await this.verifyChatStep(step,testData);
  //     return;
  //   }
  //   if (step.startsWith("M")) {
  //     console.log(`✅  ${step}`);
  //     await this.verifyMultiSelectStep(step,testData);
  //     return;
  //   }

  //   if (step === 'NEXTSTEP') {
  //     await this.clickOnContinueButton();
  //     return;
  //   }
  //   if (step === 'SUBMIT') {
  //     await this.verifyFailedScenarioInbeweenSubmit();
  //     return;
  //   }
  //   if (step === 'RESTART') {
  //     await this.verifyRestartPopup();
  //     return;
  //   }
  // }
  private async verifyRestartPopup() {
    //await this.page.pause();
    await this.restartButton.click();
    await this.clickOnIntroductionContinueButton();
  }
  private async verifyFailedScenarioInbeweenSubmit() {
    // Verify text from chat section
    // await expect(this.chatEndMessage1).toHaveText("This conversation has ended without a positive resolution.");
    // await expect(this.chatEndMessage2).toHaveText("Select the Continue button to proceed.");
    // await this.clickOnDoneButton();

    // const [level, rawAction] = previousStep.split("_");
    // const actionMap: { [key: string]: string } = {
    //   INCORRECT: "incorrect",
    //   DISTRACTOR: "distractor"
    // };
    // await expect(this.noOfAttemptChatPopup).toHaveText(`Attempts Remaining: ${3 - attemptNumber}`);
    // const actionKey = actionMap[rawAction.toUpperCase()];
    // const actionDetails = testData[level];
    // const attemptEndingText = actionDetails[actionKey + "_attempt_ending_popup_text"];
    // const feedbackPopupFirstText = "The conversation path you took didn't reach a positive resolution.  " + attemptEndingText;
    // const feedbackPopupSecondText = "Continue practicing your problem solving and communication skills by retrying the scenario once again or select the Submit button to end the scenario and submit your results to your teacher.";

    // // Verify text on popup for incorrect attempt
    // await expect(this.feedbackPopupText1).toHaveText(feedbackPopupFirstText);
    // await expect(this.feedbackPopupText2).toHaveText(feedbackPopupSecondText);
    //await this.clickOnContinueButton();
    await this.clickOnSubmitButton();
    //await this.page.pause();
  }
  // private parseDisplayedTime(displayedTime: string): number {
  //   if (!displayedTime) return 0;

  //   const minMatch = displayedTime.match(/(\d+)\s*min/);
  //   const secMatch = displayedTime.match(/(\d+)\s*sec/);

  //   const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
  //   const seconds = secMatch ? parseInt(secMatch[1], 10) : 0;

  //   return (minutes * 60) + seconds;
  // }

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
    } else {
      // Handle the last unpaired element
      result.push(parts[i]);
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

  return [];
}
private async processStep(step: string, nextStepForHint:string, testData: any) {
    if (step === 'HINT') {
      return;
    }

    if (step.includes("_CORRECT")) {
      await this.verifySingleSelectStep(step,testData);
      return;
    }

    if (step.startsWith("TS")) {
      await this.verifyTapAndTapStep(step,testData);
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

  private async verifyHintPopup(step: string, testData: any) {
    
    if (step.startsWith('S') && !step.startsWith('TS')) {
      await this.verifySingleSelectHintPopup(step, testData);
    } else if (step.startsWith('TS')) {
      //await this.verifyFollowUpSceneHints(step, testData);
    }
  }

  private async verifySingleSelectHintPopup(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const stepDetails = testData['STEP_' + stepNumber];
    const actualStepNumber = stepNumber ? parseInt(stepNumber, 10) : null;
     if (actualStepNumber === null) {
    throw new Error(`Invalid step format: ${step}`);
    }
    await this.hintButton.nth(actualStepNumber-1).isVisible(); 
    await this.hintButton.nth(actualStepNumber-1).isEnabled();
    await this.hintButton.nth(actualStepNumber-1).click();
    await expect(this.hintTitle).toHaveText("Hint");
    const thinkItemTexts = stepDetails.hints.thinkAbout;
    const thinkItems = await this.hintPopupThinkListItems.all();
    expect(thinkItems.length).toBe(thinkItemTexts.length);

    for (let i = 0; i < thinkItemTexts.length; i++) {
      await expect(thinkItems[i]).toHaveText(thinkItemTexts[i]);
    }

    const askItemTexts = stepDetails.hints.askYourself;
    const askItems = await this.hintPopupAskListItems.all();
    expect(askItems.length).toBe(askItemTexts.length);

    for (let i = 0; i < askItemTexts.length; i++) {
      await expect(askItems[i]).toHaveText(askItemTexts[i]);
    }
    await this.clickOnPopupContinueButton();
  }

  // private async verifyFollowUpSceneHints(step: string, testData: any) {
  //   const stepNumber = step.match(/FS(\d+)/)?.[1];
  //   const actualStepNumber = stepNumber ? parseInt(stepNumber, 10) * 2 : null;
  //    if (actualStepNumber === null) {
  //   throw new Error(`Invalid step format: ${step}`);
  //   }
  //   await this.hintButton.nth(actualStepNumber-1).isVisible(); 
  //   await this.hintButton.nth(actualStepNumber-1).isEnabled();
  //   await this.hintButton.nth(actualStepNumber-1).click();
  //   await expect(this.hintTitle).toHaveText("Hint");
  //   const stepDetails = testData['SCENE' + stepNumber];
  //   const listContent = stepDetails.followUp.hints;
  //   console.log("No of Hint" +listContent.length);
  //   const listItem = await this.hintPopupListItems.all();
  //   //expect(listItem.length).toBe(listContent.length);

  //   for (let i = 0; i < listContent.length; i++) {
  //     await expect(listItem[i]).toHaveText(listContent[i]);
  //   }
  //   await this.clickOnPopupContinueButton();
  // }

  private async getOptionIds(step: string, preStep?: string) {
    if (step.startsWith('S') && !step.startsWith('FS')) {
      return this.getMainSceneOptionIds(step);
    } else if (step.startsWith('FS')) {
      return this.getFollowUpSceneOptionIds(step, preStep);
    }
    return [];
  }

  private getMainSceneOptionIds(step: string): string[] {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const count = Number(stepNumber) * 2 - 1; 
    if (!stepNumber) return [];
    
    return [
      `slt_step_${count}_opt_1`,
      `slt_step_${count}_opt_2`,
      `slt_step_${count}_opt_3`
    ];
  }

  private getFollowUpSceneOptionIds(step: string, preStep?: string): string[] {
    const fsNumber = step.match(/FS(\d+)/)?.[1];
    if (!fsNumber || !preStep) return [];
    
    const multipliedStep = parseInt(fsNumber) * 2;
    let correctIncorrectNumber: string;
    
    if (preStep.includes('_CORRECT')) {
      correctIncorrectNumber = '1';
    } else if (preStep.includes('_INCORRECT_')) {
      const incorrectMatch = preStep.match(/_INCORRECT_(\d+)/);
      correctIncorrectNumber = incorrectMatch ? (parseInt(incorrectMatch[1]) + 1).toString() : '2';
    } else {
      correctIncorrectNumber = '1';
    }
    
    return [
      `mlt_step_${multipliedStep}_${correctIncorrectNumber}_opt_1`,
      `mlt_step_${multipliedStep}_${correctIncorrectNumber}_opt_2`,
      `mlt_step_${multipliedStep}_${correctIncorrectNumber}_opt_3`,
      `mlt_step_${multipliedStep}_${correctIncorrectNumber}_opt_4`
    ];
  }

  private async verifySingleSelectStep(step: string,testData: any) {
    await this.verifyStepInstruction(step,testData);
    await this.verifyQuestion(step, testData);
    await this.verifySingleSelectOptions(step, testData);
    await this.selectSingleSelectOptions(step, testData);
  }


  private async verifyStepInstruction(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const stepDetails = testData["STEP_"+stepNumber];
    const instructionText = stepDetails.instructions;
    await expect(this.stepDescription).toHaveText("Scenario Description");
    await expect(this.stepInstruction).toHaveText(instructionText);
    await this.clickOnPopupContinueButton();
    const instructionListItemsText = stepDetails.instructionsList;
    const noOfInstructionListItems = await this.stepInstructionList.all();
    for (let i = 0; i < instructionListItemsText.length; i++) {
     await expect(noOfInstructionListItems[i]).toHaveText(instructionListItemsText[i]);
    }
  }


  private async verifySpeechBubbleConversation(step: string, testData: any) {
     const stepNumber = step.match(/S(\d+)/)?.[1];
    const stepDetails = testData["SCENE"+stepNumber];
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
    let stepID='';
    let stepType='';
    const stepNumber = step.match(/S(\d+)/)?.[1];
    sceneLevel = 'STEP_' + stepNumber;
    stepDetails = testData[sceneLevel];
    questionText = stepDetails.decisionPoint.question;
    stepID="slt_step_"+ stepNumber;
    stepType="single"
    const questionLocator=`//*[contains(@id,'${stepID}')]/ancestor::*[contains(@class,'${stepType}-select-component')]/preceding-sibling::strong`
    await expect(this.frameLocator.locator(questionLocator)).toHaveText(questionText);
  }

   private async verifySingleSelectOptions(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const optionIds = await this.getOptionIds(step);
    
    if (optionIds.length < 3) {
      throw new Error(`Expected at least 3 options for step ${step}, got ${optionIds.length}`);
    }

    const stepDetails = testData['STEP' + stepNumber];
    const correctOptionText = stepDetails.CORRECT;
    const incorrectOptionText = stepDetails.INCORRECT_1;
    const incorrectOptionText2 = stepDetails.INCORRECT_2;
    
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[0]}']//following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(incorrectOptionText);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[1]}']//following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(correctOptionText);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[2]}']//following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(incorrectOptionText2);
  }
  private async selectSingleSelectOptions(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const optionIds = await this.getOptionIds(step);
    if (optionIds.length < 3) {
      throw new Error(`Expected at least 3 options for step ${step}, got ${optionIds.length}`);
    }
    const stepDetails = testData['STEP' + stepNumber];
    let selectedOptionID: string;
    let decisionPointFeedback: string;
    let decisionPointFeedbackTitle: string;
    if (step.includes('_CORRECT')) {
      selectedOptionID = optionIds[1];
      decisionPointFeedback = stepDetails.decisionPointFeedback.ideal.text;
      decisionPointFeedbackTitle = stepDetails.decisionPointFeedback.ideal.title;
    } else if (step.includes('_INCORRECT_1')) {
      selectedOptionID = optionIds[0];
      decisionPointFeedback = stepDetails.decisionPointFeedback.nonIdeal.text;
      decisionPointFeedbackTitle = stepDetails.decisionPointFeedback.nonIdeal.title;
    } else if (step.includes('_INCORRECT_2')) {
      selectedOptionID = optionIds[2];
      decisionPointFeedback = stepDetails.decisionPointFeedback.nonIdeal.text;
      decisionPointFeedbackTitle = stepDetails.decisionPointFeedback.nonIdeal.title;
    } else {
      throw new Error(`Unknown step format: ${step}`);
    }

    await this.frameLocator.locator(`//button[@id='${selectedOptionID}']`).first().click();
    await expect(this.frameLocator.locator(`//button[@id='${selectedOptionID}']//following-sibling::p[contains(@class,'card-text')]`).nth(1)).toHaveText(decisionPointFeedback);
    await expect(this.frameLocator.locator(`//button[@id='${selectedOptionID}']//following-sibling::p[contains(@class,'card-text')]/preceding-sibling::strong`)).toHaveText(decisionPointFeedbackTitle);

  }

  
}