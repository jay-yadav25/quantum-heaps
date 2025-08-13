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

 public async runScenarioPathForActivityFourCHallengeMode(path: string[], testData: any) {
  for (let i = 0; i < path.length; i++) {
    const rawStep = path[i];
    await this.processStep(rawStep, testData);
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

  private async processStep(step: string, testData: any) {

    if (step.startsWith("S")) {
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
    // let stepDetails: any;
    // let questionText = '';
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
    //const stepNumber = step.match(/S(\d+)/)?.[1];
    const stepDetails = testData["STEP_"+sceneLevel];
    const instructionText = stepDetails.instruction;
    await expect(this.stepInstruction).toHaveText(instructionText);
    const instructionListItemsText = stepDetails.instructionsList;
    const noOfInstructionListItems = await this.stepInstructionList.all();
    for (let i = 0; i < instructionListItemsText.length; i++) {
     await expect(noOfInstructionListItems[i]).toHaveText(instructionListItemsText[i]);
    }
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
      stepDetails = testData[sceneLevel];
      questionText = stepDetails.decisionPoint.question;
    }

    const stepID = this.getStepOptionIds(step)[0];
    console.log(questionText);
    const questionLocator=`//*[contains(@id,'${stepID}')]/ancestor::*[contains(@class,'')]/preceding-sibling::strong`
    await expect(this.frameLocator.locator(questionLocator)).toHaveText(questionText);
  }

  

  private async verifyAndSelectSingleSelectOptions(step: string, testData: any) {
    const stepNumber = step.match(/S(\d+)/)?.[1];
    const optionIds = await this.getStepOptionIds(step);
    
    if (optionIds.length < 3) {
      throw new Error(`Expected at least 3 options for step ${step}, got ${optionIds.length}`);
    }

    const stepDetails = testData['SCENE_' + stepNumber];
    const correctOptionText = stepDetails.ideal;
    const incorrectOptionText = stepDetails.nonIdeal1;
    const incorrectOptionText2 = stepDetails.nonIdeal2;
    
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[0]}']`).first()).toHaveText(incorrectOptionText);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[1]}']`).first()).toHaveText(correctOptionText);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[2]}']`).first()).toHaveText(incorrectOptionText2);

    let selectedOptionID: string;
    if (step.includes('_CORRECT')) {
      selectedOptionID = optionIds[1];
    } else if (step.includes('_INCORRECT_1')) {
      selectedOptionID = optionIds[0];
    } else if (step.includes('_INCORRECT_2')) {
      selectedOptionID = optionIds[2];
    } else {
      throw new Error(`Unknown step format: ${step}`);
    }
    await this.frameLocator.locator(`//button[@id='${selectedOptionID}']`).first().click()
  }

  private async verifyAndSelectSingleSelectChatOptions(step: string, testData: any) {
    let sceneLevel=''
    const match = step.match(/^C(\d+)\.(\d+)_/);
      if (match) {
        const [_, major, minor] = match;
        sceneLevel = `STEP_${major}_${minor}`;
      }
    const optionIds = await this.getStepOptionIds(step);
    
    if (optionIds.length < 3) {
      throw new Error(`Expected at least 3 options for step ${step}, got ${optionIds.length}`);
    }

    const stepDetails = testData['SCENE_' + sceneLevel];
    const correctOptionText = stepDetails.ideal;
    const incorrectOptionText = stepDetails.nonIdeal1;
    const incorrectOptionText2 = stepDetails.nonIdeal2;
    const defaultChat = stepDetails.pt_message;
    await expect(this.frameLocator.locator(`//span[@id='slt_${sceneLevel}_default_chat_${sceneLevel}']`).first()).toHaveText(defaultChat);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[0]}']`).first()).toHaveText(incorrectOptionText);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[1]}']`).first()).toHaveText(correctOptionText);
    await expect(this.frameLocator.locator(`//button[@id='${optionIds[2]}']`).first()).toHaveText(incorrectOptionText2);

    let selectedOptionID: string;
    let chatReply: string;
    let selectedOption: string;
    if (step.includes('_CORRECT')) {
      selectedOptionID = optionIds[1];
      chatReply=stepDetails.CORRECT_1_REPLY;
      selectedOption=correctOptionText;
      
    } else if (step.includes('_INCORRECT_1')) {
      selectedOptionID = optionIds[0];
      chatReply=stepDetails.INCORRECT_1_REPLY;
      selectedOption=incorrectOptionText;
    } else if (step.includes('_INCORRECT_2')) {
      selectedOptionID = optionIds[2];
      chatReply=stepDetails.INCORRECT_2_REPLY;
      selectedOption=incorrectOptionText2;
    } else {
      throw new Error(`Unknown step format: ${step}`);
    }
   await this.frameLocator.locator(`//button[@id='${selectedOptionID}']`).first().click()
   await expect(this.frameLocator.locator(`//section[.//*[@id='slt_${sceneLevel}_default_chat_${sceneLevel}']]//div[contains(@class, 'chat-message-reply')]`).first()).toHaveText(chatReply);
   await expect(this.frameLocator.locator(`//section[.//*[@id='slt_${sceneLevel}_default_chat_${sceneLevel}']]//div[contains(@class, 'message-bubble message-option')]/span`).first()).toHaveText(selectedOption);
     
  }

  private async verifyAndSelectMultiSelectOptions(step: string, testData: any) {
    let sceneLevel=''
    const match = step.match(/^M(\d+)\.(\d+)_/);
        if (match) {
          const [_, major, minor] = match;
          sceneLevel = `STEP_${major}_${minor}`;
        }
    const stepDetails = testData['STEP_' + sceneLevel];
    const stepData = stepDetails[step];
    
    if (!stepData) {
      console.log(`No data found for step: ${step}`);
      return;
    }
    const idealChoices = stepDetails.correctAnswers || [];
    const nonIdealChoices = stepDetails.incorrectAnswers || [];
    
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
      }
      
      if (optionToClick) {
        const commonLocatorMultiselect=`//button[contains(@id, 'slt_step_${sceneLevel}') and normalize-space(string(./text())) = '${optionToClick}']`
        await this.frameLocator.locator(commonLocatorMultiselect).first().click();
        console.log("clicked:"+ optionToClick)
       
      }
    }
  }
}