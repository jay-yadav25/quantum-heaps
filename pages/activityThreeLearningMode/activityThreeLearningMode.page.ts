import { expect, Locator, FrameLocator, type Page } from '@playwright/test';

export class ActivityThree {
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
  readonly stepInstructionList:Locator;
  private scenarioStartTime: number = 0;

  constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.startButton = this.frameLocator.locator("//button[@id='start-btn']");
    this.submitButton = this.frameLocator.locator("//button[@id='submit-btn']");
    this.continueButton = this.frameLocator.locator("button#continue-btn");
     this.introductionContinueButton = this.frameLocator.locator("button#introduction-continue-btn");
    this.hintButton = this.frameLocator.locator("button#chat-hint-btn");
    this.popupCloseButton = this.frameLocator.locator("#popup-close-btn").first();
    this.hintTitle = this.frameLocator.locator("#dialog_label");
    this.hintPopupAskListItems = this.frameLocator.locator(""); 
    this.hintPopupListItems = this.frameLocator.locator("ul.info-list-container>li>p"); 
    this.hintPopupThinkListItems = this.frameLocator.locator("");
    this.stepInstruction = this.frameLocator.locator("div.instruction-content");
    this.stepInstructionList = this.frameLocator.locator("ul.instruction-description>li");
  }

  public async launchActivity() {
    await this.page.goto("https://dev-cengage-dho.zeuslearning.com/launcherPages/cengage_dho_launcher.html?launchType=1&dho=dm_l_03&attemptId=1");
  }

 public async runScenarioPathForActivityThreeLearnigMode(path: string[], testData: any) {
  for (let i = 0; i < path.length; i++) {
    const rawStep = path[i];
    const nextStep = path[i + 1];
    
    // Find the actual current step based on the logic
    const currentStep = this.findCurrentStep(path, i);
    
    // Find the actual previous step (not HINT or NEXTSTEP)
    const previousStep = this.findPreviousStep(path, i);
    
    await this.processStep(rawStep,currentStep,previousStep, testData);
  }
}

private findCurrentStep(path: string[], currentIndex: number): string {
  const rawStep = path[currentIndex];
  
  if (rawStep === 'HINT') {
    // For HINT, use the previous valid step
    return this.findPreviousValidStep(path, currentIndex);
  } else if (rawStep === 'NEXTSTEP') {
    // For NEXTSTEP, use the next valid step
    return this.findNextValidStep(path, currentIndex);
  } else {
    // For regular steps, return as-is
    return rawStep;
  }
}

private findPreviousValidStep(path: string[], currentIndex: number): string {
  // Go backwards from current position
  for (let i = currentIndex - 1; i >= 0; i--) {
    const stepName = path[i];
    if (stepName !== 'HINT' && stepName !== 'NEXTSTEP') {
      return stepName;
    }
  }
  return "NOTFOUND";
}

private findNextValidStep(path: string[], currentIndex: number): string {
  // Go forwards from current position
  for (let i = currentIndex + 1; i < path.length; i++) {
    const stepName = path[i];
    if (stepName !== 'HINT' && stepName !== 'NEXTSTEP') {
      return stepName;
    }
  }
  return "NOTFOUND";
}

private findPreviousStep(path: string[], currentIndex: number): string {
  // If we're at the first step, there's no previous step
  if (currentIndex <= 0) {
    return "NOTFOUND";
  }
  
  // Go backwards from current position
  for (let i = currentIndex - 1; i >= 0; i--) {
    const stepName = path[i];
    
    // Check if this step is not HINT or NEXTSTEP
    if (stepName !== 'HINT' && stepName !== 'NEXTSTEP') {
      return stepName;
    }
  }
  
  // If we've gone through all previous steps and found none that aren't HINT or NEXTSTEP
  return "NOTFOUND";
}

  public async clickOnStartButton() {
   await this.startButton.click();
  }

  public async verifyLearningObjectivePageIsVisible() {
    await this.page.waitForTimeout(5000);
    await this.startButton.isVisible();
  }
  public async verifyTitleAndLearningObjectives() {
    //await expect
  }

  public async verifyIntroductionPageIsVisible() {
    await this.introductionContinueButton.isVisible();
  }
  public async verifyIntroduction() {
   // await expect()
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

  private async processStep(step: string, currentStep: string, previousStep: string, testData: any) {
    if (step === 'HINT') {
      console.log(`✅ Hint Opened — Last step was ${previousStep}`);
      await this.verifyHintPopup(currentStep, testData);
      return;
    }

    if (step.startsWith("S")) {
      await this.verifyMainScene(step,previousStep, testData);
      return;
    }

    if (step.startsWith("FS")) {
      console.log(`✅ COMPLETE reached — Last step was ${previousStep}`);
      await this.verifyFollowUpScene(step, previousStep, testData);
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

  private async verifyHintPopup(currentStep: string, testData: any) {
    await this.clickOnHintButton();
    await expect(this.hintTitle).toHaveText("");
    
    if (currentStep.startsWith('S') && !currentStep.startsWith('FS')) {
      await this.verifyMainSceneHints(currentStep, testData);
    } else if (currentStep.startsWith('FS')) {
      await this.verifyFollowUpSceneHints(currentStep, testData);
    }
    
    await this.clickOnContinueButton();
  }

  private async verifyMainSceneHints(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const stepDetails = testData['SCENE' + stepNumber];

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
  }

  private async verifyFollowUpSceneHints(step: string, testData: any) {
    const stepNumber = step.match(/FS(\d+)/)?.[1];
    const stepDetails = testData['SCENE' + stepNumber];
    const listContent = stepDetails.followUp.hints;
    const listItem = await this.hintPopupListItems.all();
    expect(listItem.length).toBe(listContent.length);

    for (let i = 0; i < listContent.length; i++) {
      await expect(listItem[i]).toHaveText(listContent[i]);
    }
    await this.clickOnContinueButton();
  }

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

  private async verifyMainScene(step: string,previousStep:string, testData: any) {
    await this.verifyStepInstruction(step, testData);
    await this.verifySpeechBubbleConversation(step, testData);
    await this.verifyQuestion(step,previousStep, testData);
    await this.verifyAndSelectDecisionPointOptions(step, testData);
  }

  private async verifyFollowUpScene(step: string, previousStep: string, testData: any) {
    await this.verifyStepInstructionFollowUpScene(step, previousStep,testData);
    await this.verifyQuestion(step,previousStep, testData);
    await this.verifyAndSelectFollowUpQuestionOptions(step, previousStep, testData);
  }

  private async verifyStepInstruction(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const stepDetails = testData["SCENE"+stepNumber];
    const instructionText = stepDetails.instructions;
    await expect(this.stepInstruction).toHaveText(instructionText);
    const instructionListItemsText = stepDetails.instructionsList;
    const noOfInstructionListItems = await this.stepInstructionList.all();
    for (let i = 0; i < instructionListItemsText.length; i++) {
     await expect(noOfInstructionListItems[i]).toHaveText(instructionListItemsText[i]);
    }
  }

  private async verifyStepInstructionFollowUpScene(step: string, previousStep:string,testData: any) {
    const stepNumber = step.match(/FS(\d+)/)?.[1];
    const stepDetails = testData['SCENE' + stepNumber];
    const [sceneCode, ...optionParts] = previousStep.split('_');
    const optionKey = optionParts.join('_');
    const followUpKey = this.mapOptionToFollowUpKey(optionKey);
    const instructionText = stepDetails.followUp[followUpKey].instructions;
    const instructionListItemsText = stepDetails.followUp[followUpKey].instructionsList;
   // await expect(this.stepInstruction).toHaveText(instructionText);
    const noOfInstructionListItems = await this.stepInstructionList.all();
    for (let i = 0; i < instructionListItemsText.length; i++) {
     //await expect(noOfInstructionListItems[i]).toHaveText(instructionListItemsText[i]);
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
        await expect(this.frameLocator.locator(`//h3[@class='name-title' and normalize-space()='${characterName}']/following-sibling::span[1]`).first()).toHaveText(speechBubbleTexts[i].text);
      }
    }
  }

  private async verifyQuestion(step: string,previousStep:string, testData: any) {
    const [sceneCode, ...optionParts] = step.split('_');
    const optionKey = optionParts.join('_');

    let sceneLevel = '';
    let stepDetails: any;
    let questionText = '';
    let stepID='';
    let stepType='';

    if (step.startsWith('S') && !step.startsWith('FS')) {
      const stepNumber = step.match(/S(\d+)/)?.[1];
      sceneLevel = 'SCENE' + stepNumber;
      stepDetails = testData[sceneLevel];
      questionText = stepDetails.decisionPoint.question;
      const count = Number(sceneCode.slice(1)) * 2 - 1; 
      stepID="slt_step_"+ count;
      stepType="single"
    } else if (step.startsWith('FS')) {
      const stepNumber = step.match(/FS(\d+)/)?.[1];
      const stepDetails = testData['SCENE' + stepNumber];
      const [sceneCode, ...optionParts] = previousStep.split('_');
      const optionKey = optionParts.join('_');
      const followUpKey = this.mapOptionToFollowUpKey(optionKey);
      questionText = stepDetails.followUp?.[followUpKey]?.question;
      console.log(followUpKey);
      //stepID="mlt_step_"+ parseInt(sceneCode.match(/\d+/)?.[0] || '0', 10) * 2;
      stepID = `mlt_step_${(parseInt(sceneCode.match(/\d+/)?.[0] || '0', 10) * 2)}`;

      stepType="multi"
    }
    console.log(questionText);
    const questionLocator=`//*[contains(@id,'${stepID}')]/ancestor::*[contains(@class,'${stepType}-select-component')]/preceding-sibling::strong`
    await expect(this.frameLocator.locator(questionLocator)).toHaveText(questionText);
  }

  private mapOptionToFollowUpKey(option: string): string {
    switch (option.toUpperCase()) {
      case 'INCORRECT_1':
        return 'nonIdealFollowUp1';
      case 'INCORRECT_2':
        return 'nonIdealFollowUp2';
      case 'CORRECT':
        return 'idealFollowUp';
      default:
        return '';
    }
  }

  private async verifyAndSelectDecisionPointOptions(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const optionIds = await this.getOptionIds(step);
    
    if (optionIds.length < 3) {
      throw new Error(`Expected at least 3 options for step ${step}, got ${optionIds.length}`);
    }

    const stepDetails = testData['SCENE' + stepNumber];
    const correctOptionText = stepDetails.decisionPoint.ideal;
    const incorrectOptionText = stepDetails.decisionPoint.nonIdeal1;
    const incorrectOptionText2 = stepDetails.decisionPoint.nonIdeal2;
    
    // await expect(this.frameLocator.locator(`//button[@id='${optionIds[0]}']//following-sibling::p[@class='card-text']`).first()).toHaveText(incorrectOptionText);
    // await expect(this.frameLocator.locator(`//button[@id='${optionIds[1]}']//following-sibling::p[@class='card-text']`).first()).toHaveText(correctOptionText);
    // await expect(this.frameLocator.locator(`//button[@id='${optionIds[2]}']//following-sibling::p[@class='card-text']`).first()).toHaveText(incorrectOptionText2);

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
    await expect(this.frameLocator.locator(`//button[@id='${selectedOptionID}']//following-sibling::p[@class='card-text']`).nth(1)).toHaveText(decisionPointFeedback);
    await expect(this.frameLocator.locator(`//button[@id='${selectedOptionID}']//following-sibling::p[@class='card-text']/preceding-sibling::h3`)).toHaveText(decisionPointFeedbackTitle);

  }

  private async verifyAndSelectFollowUpQuestionOptions(step: string, previousStep: string, testData: any) {
    const fsNumber = step.match(/FS(\d+)/)?.[1];
    const stepDetails = testData['SCENE' + fsNumber];
    const stepData = stepDetails[step];
    
    if (!stepData) {
      console.log(`No data found for step: ${step}`);
      return;
    }

    let feedbackType: string;
    if (previousStep.includes('_CORRECT')) {
      feedbackType = "idealChoiceFeedback";
    } else {
      feedbackType = "nonIdealChoiceFeedback";
    }

    const idealChoices = stepDetails.followUp.correctAnswers || [];
    const nonIdealChoices = stepDetails.followUp.incorrectAnswers || [];
    
    for (const item of stepData) {
      let optionToClick:any;
      
      if (item.startsWith("CORRECT")) {
        const correctIndex = parseInt(item.split("_")[1]) - 1;
        if (correctIndex >= 0 && correctIndex < idealChoices.length) {
          optionToClick = idealChoices[correctIndex];
        }
      } else if (item.startsWith("INCORRECT")) {
        const incorrectIndex = parseInt(item.split("_")[1]) - 1;
        if (incorrectIndex >= 0 && incorrectIndex < nonIdealChoices.length) {
          optionToClick = nonIdealChoices[incorrectIndex];
        }
      } else if (item.startsWith("HINT")) {
        this.verifyHintPopup(step,testData);
        continue;
        }
      
      if (optionToClick) {
        const selectedOptionFeedback = stepDetails.followUp[feedbackType][optionToClick];
        const actualStepNumber = fsNumber ? parseInt(fsNumber, 10) * 2 : null;
        const commonLocatorMultiselect=`//button[contains(@id, 'mlt_step_${actualStepNumber}') ]//strong[normalize-space(text()) = '${optionToClick}']`
        await this.frameLocator.locator(commonLocatorMultiselect).first().click();
        console.log("clicked:"+ optionToClick)
        await expect(this.frameLocator.locator(`${commonLocatorMultiselect}/following-sibling::strong[@class='card-sub-title']`).first()).toHaveText(selectedOptionFeedback.title);
        //await expect(this.frameLocator.locator(`${commonLocatorMultiselect}/following-sibling::p[@class='card-text']`).first()).toHaveText(selectedOptionFeedback.text);
       
      }
    }
  }
}