import { expect, Locator, FrameLocator, type Page } from '@playwright/test';
import { Console } from 'console';

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
private seenSteps: Set<string> = new Set();

  // Helper method to extract step number (e.g., "S1_CORRECT" -> "S1")
  private getStepNumber(step: string): string | null {
    const match = step.match(/^(S\d+)/);
    return match ? match[1] : null;
  }

  // Helper method to check if this is the first occurrence of a step
  private isFirstOccurrence(step: string): boolean {
    const stepNumber = this.getStepNumber(step);
    if (!stepNumber) return false;
    
    if (this.seenSteps.has(stepNumber)) {
      return false; // We've seen this step before
    } else {
      this.seenSteps.add(stepNumber); // Mark as seen
      return true; // First time seeing this step
    }
  }

  private async processStep(step: string, nextStepForHint: string, testData: any) {
    if (step === 'HINT') {
      await this.verifyHintPopup(nextStepForHint, testData);
      return;
    }

    if (step.startsWith("S")) {
      // Check if this is the first occurrence of this step number
      const isFirstOccurrence = this.isFirstOccurrence(step);
      
      // Call verifyStepInstruction only on first occurrence
      if (isFirstOccurrence) {
        await this.verifySingleSelectStep(step, testData);
      }
      await this.selectSingleSelectOptions(step, testData);
      
      return;
    }

    if (step.startsWith("TS")) {
      await this.verifyTapAndTapStep(step, testData);
      return;
    }

    if (step.startsWith("NEXTSTEP")) {
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

  

  private async verifyHintPopup(step: string, testData: any) {
      await this.verifySingleSelectHintPopup(step, testData);
  }

  private async verifySingleSelectHintPopup(step: string, testData: any) {
    const stepNumber = this.getStepNumber(step);
    const stepDetails = testData['STEP_' + stepNumber];
    const actualStepNumber = stepNumber ? parseInt(stepNumber, 10) : null;
     if (actualStepNumber === null) {
    throw new Error(`Invalid step format: ${step}`);
    }
    await this.hintButton.nth(actualStepNumber-1).isVisible(); 
    await this.hintButton.nth(actualStepNumber-1).isEnabled();
    await this.hintButton.nth(actualStepNumber-1).click();
    await expect(this.hintTitle).toHaveText("Hint");
    const thinkItemTexts = stepDetails.hints.ThinkAbout;
    const thinkItems = await this.hintPopupThinkListItems.all();
    expect(thinkItems.length).toBe(thinkItemTexts.length);

    for (let i = 0; i < thinkItemTexts.length; i++) {
      await expect(thinkItems[i]).toHaveText(thinkItemTexts[i]);
    }

    const askItemTexts = stepDetails.hints.AskYourself;
    const askItems = await this.hintPopupAskListItems.all();
    expect(askItems.length).toBe(askItemTexts.length);

    for (let i = 0; i < askItemTexts.length; i++) {
      await expect(askItems[i]).toHaveText(askItemTexts[i]);
    }
    await this.clickOnPopupContinueButton();
  }


  private getOptionIds(step: string): string[] {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const count = Number(stepNumber) * 2 - 1; 
    if (!stepNumber) return [];
    
    return [
      `slt_step_${count}_opt_1`,
      `slt_step_${count}_opt_2`,
      `slt_step_${count}_opt_3`
    ];
  }

  private async verifySingleSelectStep(step: string,testData: any) {
    await this.verifyStepInstruction(step,testData);
   // await this.verifyQuestion(step, testData);
    await this.verifySingleSelectOptions(step, testData);
    //await this.selectSingleSelectOptions(step, testData);
  }
  private async verifyTapAndTapStep(step: string,testData: any) {
    await this.verifyStepInstruction(step,testData);
    //await this.verifyQuestion(step, testData);
    await this.selectTapAndTapOptions(step,testData);
  }


  private async verifyStepInstruction(step: string, testData: any) {
    const stepNumber =this.extractStepNumber(step);
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
    
    const stepNumber = step.match(/S(\d+)/)?.[1];
    sceneLevel = 'STEP_' + stepNumber;
    stepDetails = testData[sceneLevel];
    questionText = stepDetails.question;
    const questionLocator=`.step-${stepNumber} h3`
    await expect(this.frameLocator.locator(questionLocator)).toHaveText(questionText);
  }

   private async verifySingleSelectOptions(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const stepDetails = testData['STEP_' + stepNumber];
    const correctOptionText = stepDetails.CORRECT;
    const incorrectOptionText = stepDetails.INCORRECT_1;
    const incorrectOptionText2 = stepDetails.INCORRECT_2;
    // await expect(this.frameLocator.locator(`.step-${stepNumber} #mlt_step_${stepNumber}_opt_1 .flip-card-front  .card-title`).first()).toHaveText(incorrectOptionText);
    // await expect(this.frameLocator.locator(`.step-${stepNumber} #mlt_step_${stepNumber}_opt_2 .flip-card-front  .card-title`).first()).toHaveText(correctOptionText);
    // await expect(this.frameLocator.locator(`.step-${stepNumber} #mlt_step_${stepNumber}_opt_3 .flip-card-front  .card-title`).first()).toHaveText(incorrectOptionText2);
  }
  private async selectSingleSelectOptions(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const optionIds = await this.getOptionIds(step);
    if (optionIds.length < 3) {
      throw new Error(`Expected at least 3 options for step ${step}, got ${optionIds.length}`);
    }
    const stepDetails = testData['STEP_' + stepNumber];
    let selectedOptionID: number;
    let decisionPointFeedback: string;
    let decisionPointFeedbackTitle: string;
    if (step.includes('_CORRECT')) {
      selectedOptionID = 2;
      decisionPointFeedback = stepDetails.feedback.CORRECT.text;
      decisionPointFeedbackTitle = stepDetails.feedback.CORRECT.title;
    } else if (step.includes('_INCORRECT_1')) {
      selectedOptionID = 1;
      decisionPointFeedback = stepDetails.feedback.INCORRECT_1.text;
      decisionPointFeedbackTitle = stepDetails.feedback.INCORRECT_1.title;
    } else if (step.includes('_INCORRECT_2')) {
      selectedOptionID = 3;
      decisionPointFeedback = stepDetails.feedback.INCORRECT_2.text;
      decisionPointFeedbackTitle = stepDetails.feedback.INCORRECT_2.title;
    } else {
      throw new Error(`Unknown step format: ${step}`);
    }

    await this.frameLocator.locator(`.step-${stepNumber} #mlt_step_${stepNumber}_opt_${selectedOptionID}`).first().click();
    // await expect(this.frameLocator.locator(`.step-${stepNumber} #mlt_step_${stepNumber}_opt_${selectedOptionID} .flip-card-back  .card-text`)).toHaveText(decisionPointFeedback);
    // await expect(this.frameLocator.locator(`.step-${stepNumber} #mlt_step_${stepNumber}_opt_${selectedOptionID} .flip-card-back  .card-title`)).toHaveText(decisionPointFeedbackTitle);

  }

  private async selectTapAndTapOptions(step: string, testData: any) {
    const stepNumber = this.extractStepNumber(step);
    const optionIds = await this.getOptionIds(step);
    const stepDetails = testData['STEP_' + stepNumber];
    //const result1 = input.replace(/^TS8_/, "");
    const actions=step.replace(/^TS9_/, "");
    console.log(actions);
    const actionsToPerform=testData[actions];
    //const actionsToPerform1=testData.CORRECT;
    console.log(actionsToPerform);
    //console.log(actionsToPerform1);
    const optionOne= stepDetails.OPTION_1;
    const optionTwo= stepDetails.OPTION_2;
    const optionThree= stepDetails.OPTION_3;
    const optionFour= stepDetails.OPTION_4;
    const optionFive= stepDetails.OPTION_5;
    const optionSix= stepDetails.OPTION_6;
    const correctFeedbackPopupText = stepDetails.feedback.CORRECT;
    const incorrectFeedbackPopupText = stepDetails.feedback.INCORRECT;
    // await expect(this.frameLocator.locator(`//button[@id='${optionIds[0]}']//following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(optionOne);
    // await expect(this.frameLocator.locator(`//button[@id='${optionIds[1]}']//following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(optionTwo);
    // await expect(this.frameLocator.locator(`//button[@id='${optionIds[2]}']//following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(optionThree);
    // await expect(this.frameLocator.locator(`//button[@id='${optionIds[3]}']//following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(optionFour);
    // await expect(this.frameLocator.locator(`//button[@id='${optionIds[4]}']//following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(optionFive);
    // await expect(this.frameLocator.locator(`//button[@id='${optionIds[5]}']//following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(optionSix);
    
    for (let i = 0; i < actionsToPerform.length; i++) {
      const rawAction = actionsToPerform[i];
      if (rawAction === 'HINT') {
        await this.verifyHintPopup(step,testData);
      }else if (rawAction === 'CHECK') {
        await this.clickOnContinueButton();
        if (i=actionsToPerform.length-1){
          await this.verifyFeedbackPopupText(correctFeedbackPopupText);
        }else{
          await this.verifyFeedbackPopupText(incorrectFeedbackPopupText);
        } 
      }else{
        await this.performTapAndTapStep(rawAction);
      }
    }
  }
  private async performTapAndTapStep(actionToPerform:string) {
    console.log("action"+actionToPerform);
    const [_, optionNum, __, slotNum] = actionToPerform.split("_");
    const optionSelector = `#step_9_pickZone_1_section_1-option-${optionNum}`;
    const slotSelector = `#step_9_dropZone_1_section_1-slot-${slotNum}`;
    const snapBackButtonSelector = `#step_9_dropZone_1_section_1-slot-${slotNum}-snap-btn`;
    const slotLocator = this.frameLocator.locator(slotSelector);
    const isAvailable =(await slotLocator.isEnabled());
    if (isAvailable) {
      await this.frameLocator.locator(snapBackButtonSelector).click();
    }

    await this.frameLocator.locator(optionSelector).click();
    await this.frameLocator.locator(slotSelector).click();
}

  private async verifyFeedbackPopupText(feedbackText: any) {
    // await expect(this.frameLocator.locator('#dialog_desc .title')).toContainText(feedbackText.title);
    // await expect(this.frameLocator.locator('#dialog_desc>p')).toContainText(feedbackText.text);
    await this.popupCloseButton.click();
}
private extractStepNumber(step: string) {
        const match = step.match(/(?:S|TS)(\d+)/);
        return match ? match[1] : "0";
    }
}