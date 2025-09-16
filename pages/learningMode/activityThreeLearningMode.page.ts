import { expect, Locator, FrameLocator, type Page } from '@playwright/test';
import { ActivitySix } from './activitySixLearningMode.page';

export class ActivityThree extends ActivitySix {
  readonly hintPopupListItems: Locator;

  constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    super(page, iframeName);
    
    this.hintPopupListItems = this.frameLocator.locator("ul.info-list-container>li>p"); 
  }

  public async runScenarioPathForActivityThree(path: string[], testData: any) {
    for (let i = 0; i < path.length; i++) {
      const currentStep = path[i];
      const nextValidStep = this.findNextValidStep(path, i);
      const previousStep = path[i - 1]; 
      await this.processStepActivityThree(currentStep, nextValidStep, previousStep, testData);
    }
    await this.verifyScenarioTiming();
  }

  private async processStepActivityThree(step: string, nextValidStep: string, previousStep: string, testData: any) {
    if (step === 'HINT') {
      if (previousStep !== 'NEXTSTEP') {
        await this.verifyHintPopup(nextValidStep, testData);
      }
      return;
    }

    if (step.startsWith("S")) {
      await this.handleSingleSelectStepActivityThree(step, previousStep, testData);
      return;
    }

    if (step.startsWith("MS")) {
      await this.handleMultiSelectStepActivityThree(step, testData);
      return;
    }

    if (step === "NEXTSTEP") {
      await this.clickContinueButton();
      return;
    }
  }

  private async verifyFollowUpSceneHints(step: string, testData: any) {
    const stepNumber = step.match(/MS(\d+)/)?.[1];
    const actualStepNumber = stepNumber ? parseInt(stepNumber, 10) : null;
    if (actualStepNumber === null) {
      throw new Error(`Invalid step format: ${step}`);
    }
    const hintButtonIndex = actualStepNumber - 1;
    await this.hintButton.nth(hintButtonIndex).isVisible();
    await this.hintButton.nth(hintButtonIndex).isEnabled();
    await this.hintButton.nth(hintButtonIndex).click();
    await expect(this.hintTitle).toHaveText("Hint");
    
    const stepDetails = testData['STEP_' + stepNumber];
    const listContent = stepDetails.followUp.hints;
    console.log("No of Hint" + listContent.length);
    
    const listItem = await this.hintPopupListItems.all();

    for (let i = 0; i < listContent.length; i++) {
      await expect(listItem[i]).toHaveText(listContent[i]);
    }
    await this.popupContinueButton.nth(1).click();
  }

  private async handleSingleSelectStepActivityThree(step: string, previousStep: string, testData: any) {
    const isFirstOccurrence = this.isFirstOccurrence(step);
    
    if (isFirstOccurrence) {
      if (previousStep === 'HINT') {
        await this.verifyHintPopup(step, testData);
      }
      await this.verifySingleSelectStep(step, testData);
    }
    
    await this.selectSingleSelectOptions(step, testData);
  }

  private async handleMultiSelectStepActivityThree(step: string, testData: any) {
    await this.verifyStepInstruction(step, testData);
    await this.verifyMultiSelectStepQuestion(step, testData);
    await this.verifyAndSelectMultiselectOptions(step, testData);
  }

  private async verifyMultiSelectStepQuestion(step: string, testData: any) {
    const [sceneCode, ...optionParts] = step.split('_');
    const optionKey = optionParts.join('_');

    let sceneLevel = '';
    let stepDetails: any;
    let questionText = '';
    let stepID = '';
    let stepType = '';

    if (step.startsWith('S') && !step.startsWith('FS')) {
      const stepNumber = step.match(/S(\d+)/)?.[1];
      sceneLevel = 'SCENE' + stepNumber;
      stepDetails = testData[sceneLevel];
      questionText = stepDetails.decisionPoint.question;
      const count = Number(sceneCode.slice(1)) * 2 - 1; 
      stepID = "slt_step_" + count;
      stepType = "single"
    } else if (step.startsWith('FS')) {
      const stepNumber = step.match(/FS(\d+)/)?.[1];
      const stepDetails = testData['SCENE' + stepNumber];
      questionText = stepDetails.question;
      stepID = `mlt_step_${(parseInt(sceneCode.match(/\d+/)?.[0] || '0', 10) * 2)}`;
      stepType = "multi"
    }
    
    console.log(questionText);
    const questionLocator = `//*[contains(@id,'${stepID}')]/ancestor::*[contains(@class,'${stepType}-select-component')]/preceding-sibling::strong`
    await expect(this.frameLocator.locator(questionLocator)).toHaveText(questionText);
  }

  private async verifyAndSelectMultiselectOptions(step: string, testData: any) {
    const stepNumber = step.match(/MS(\d+)/)?.[1];
    const stepDetails = testData['STEP_' + stepNumber];
    const stepData = stepDetails[step];
    
    if (!stepData) {
      console.log(`No data found for step: ${step}`);
      return;
    }

    const idealChoices = stepDetails.correctAnswers || [];
    const nonIdealChoices = stepDetails.incorrectAnswers || [];
    
    for (const item of stepData) {
      let optionToClick: any;
      
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
        await this.verifyFollowUpSceneHints(step, testData);
        continue;
      }
      
      if (optionToClick) {
        const selectedOptionFeedback = stepDetails.feedback[optionToClick];
        const commonLocatorMultiselect = `//button[contains(@id, 'mlt_step_${stepNumber}') ]//strong[normalize-space(text()) = '${optionToClick}']`
        await this.frameLocator.locator(commonLocatorMultiselect).first().click();
        console.log("clicked:" + optionToClick)
        await expect(this.frameLocator.locator(`${commonLocatorMultiselect}/following-sibling::strong[@class='card-sub-title']`).first()).toHaveText(selectedOptionFeedback.title);
        await expect(this.frameLocator.locator(`${commonLocatorMultiselect}/following-sibling::p[contains(@class,'card-text')]`).first()).toHaveText(selectedOptionFeedback.text);
      }
    }
  }
}