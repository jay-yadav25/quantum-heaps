import { expect, Locator, FrameLocator, type Page } from '@playwright/test';

interface StepData {
  instructions?: string | string[]; // Can be string or array
  instructionsList?: string[];
  question: string;
  conversation?: Array<{title: string, text: string}>;
  hints?: {
    ThinkAbout?: string[];
    AskYourself?: string[];
  } | {[key: string]: string}; // Support both formats
  feedback?: {
    CORRECT?: { title: string; text: string };
    INCORRECT_1?: { title: string; text: string };
    INCORRECT_2?: { title: string; text: string };
    INCORRECT?: { title: string; text: string };
    [key: string]: { title: string; text: string } | undefined; // For multi-select feedback
  };
  CORRECT?: string;
  INCORRECT_1?: string;
  INCORRECT_2?: string;
  // Multi-select properties
  options?: string[];
  correctAnswers?: string[];
  incorrectAnswers?: string[];
  // Tap and tap properties
  OPTION_1?: string;
  OPTION_2?: string;
  OPTION_3?: string;
  OPTION_4?: string;
  OPTION_5?: string;
  OPTION_6?: string;
}

interface TestData {
  [key: string]: StepData | string[] | any;
}

export class ActivitySix {
  readonly page: Page;
  public readonly frameLocator: FrameLocator;
  public scenarioStartTime: number = 0;
  public seenSteps: Set<string> = new Set();

  // Core action buttons
  readonly startButton: Locator;
  readonly submitButton: Locator;
  readonly continueButton: Locator;
  readonly introductionContinueButton: Locator;
  readonly popupContinueButton: Locator;
  readonly restartButton: Locator;

  // Hint system
  readonly hintButton: Locator;
  readonly hintTitle: Locator;
  readonly hintPopupAskListItems: Locator;
  readonly hintPopupThinkListItems: Locator;

  // Popup controls
  readonly popupCloseButton: Locator;

  // Step content
  readonly stepInstruction: Locator;
  readonly stepDescription: Locator;
  readonly stepInstructionList: Locator;

  // Timing and loading
  readonly totalTimeTaken: Locator;
  readonly loader: Locator;

  // Learning objectives
  readonly learningObjectiveTitle: Locator;
  readonly learningObjectiveDetails: Locator;
  readonly activityTitleStartPage: Locator;

  // Introduction elements
  readonly introductionPopUpTitle: Locator;
  readonly introPopupText: Locator;
  readonly activityOverviewTitle: Locator;
  readonly activityOverviewDetails: Locator;

  // Navigation
  readonly moreOptionsButton: Locator;
  readonly moreOptionLearningObjectiveButton: Locator;
  readonly moreOptionIntroductionButton: Locator;

  constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.startButton = this.frameLocator.locator("button#start-btn");
    this.submitButton = this.frameLocator.locator("button#submit-btn");
    this.continueButton = this.frameLocator.locator("button#continue-btn");
    this.introductionContinueButton = this.frameLocator.locator("button#introduction-continue-btn");
    this.popupContinueButton = this.frameLocator.locator("button#continue-btn.common-done-btn");
    this.restartButton = this.frameLocator.locator('#restart-btn');

    // Hint system
    this.hintButton = this.frameLocator.locator("button#chat-hint-btn");
    this.hintTitle = this.frameLocator.locator("#dialog_label");
    this.hintPopupAskListItems = this.frameLocator.locator("ul.ask-yourself-list > li");
    this.hintPopupThinkListItems = this.frameLocator.locator("ul.think-about-list > li");

    // Popup controls
    this.popupCloseButton = this.frameLocator.locator("#popup-close-btn").first();

    // Step content
    this.stepInstruction = this.frameLocator.locator("#dialog_desc > p");
    this.stepDescription = this.frameLocator.locator("#dialog_label");
    this.stepInstructionList = this.frameLocator.locator("ul.instruction-description > li");

    // Timing and loading
    this.totalTimeTaken = this.frameLocator.locator("strong.time-value");
    this.loader = this.frameLocator.locator('div.circular-loader');

    // Learning objectives
    this.learningObjectiveTitle = this.frameLocator.locator("h2.info-title");
    this.learningObjectiveDetails = this.frameLocator.locator(".ul-wrapper > ul li");
    this.activityTitleStartPage = this.frameLocator.locator("#start-page-title");

    // Introduction elements
    this.introductionPopUpTitle = this.frameLocator.locator("h2.popup-title");
    this.introPopupText = this.frameLocator.locator("div.popup-details > p");
    this.activityOverviewTitle = this.frameLocator.locator("h3.overview-title");
    this.activityOverviewDetails = this.frameLocator.locator("ul.overview-text li");

    // Navigation
    this.moreOptionsButton = this.frameLocator.locator('button[aria-label="More Options"]');
    this.moreOptionLearningObjectiveButton = this.frameLocator.locator('li[aria-label="Learning Objectives"]');
    this.moreOptionIntroductionButton = this.frameLocator.locator('li[aria-label="Introduction"]');
  }

  public async runScenarioPath(path: string[], testData: TestData): Promise<void> {
    for (let i = 0; i < path.length; i++) {
      const currentStep = path[i];
      const nextValidStep = this.findNextValidStep(path, i);
      const previousStep = path[i - 1];
      
      await this.processStep(currentStep, nextValidStep, previousStep, testData);
    }
    
    await this.verifyScenarioTiming();
  }

  public async clickStartButton(): Promise<void> {
    await this.startButton.click();
  }

  public async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }

  public async clickIntroductionContinueButton(): Promise<void> {
    await this.introductionContinueButton.click();
    this.scenarioStartTime = performance.now();
  }

  public async clickSubmitButton(): Promise<void> {
    await this.submitButton.click();
  }

  public async clickHintButton(): Promise<void> {
    await this.hintButton.click();
  }

  public findNextValidStep(path: string[], currentIndex: number): string {
    for (let i = currentIndex + 1; i < path.length; i++) {
      const stepName = path[i];
      if (!['HINT', 'NEXTSTEP'].includes(stepName)) {
        return stepName;
      }
    }
    return "NOTFOUND";
  }

  public extractStepNumber(step: string): string {
    const match = step.match(/(?:S|TS|MS)(\d+)/);
    return match ? match[1] : "0";
  }

  public getStepNumber(step: string): string | null {
    const match = step.match(/^(S\d+|MS\d+)/);
    return match ? match[1] : null;
  }

  public isFirstOccurrence(step: string): boolean {
    const stepNumber = this.getStepNumber(step);
    if (!stepNumber) return false;
    
    if (this.seenSteps.has(stepNumber)) {
      return false;
    } else {
      this.seenSteps.add(stepNumber);
      return true;
    }
  }

  public parseDisplayedTime(displayedTime: string): number {
    if (!displayedTime) return 0;

    const minMatch = displayedTime.match(/(\d+)\s*min/);
    const secMatch = displayedTime.match(/(\d+)\s*sec/);

    const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
    const seconds = secMatch ? parseInt(secMatch[1], 10) : 0;

    return (minutes * 60) + seconds;
  }

  public async verifyScenarioTiming(): Promise<void> {
    const actualTimeTaken = performance.now() - this.scenarioStartTime;
    const displayedTime = await this.totalTimeTaken.innerText();
    const expectedSeconds = Math.round(actualTimeTaken / 1000);

    console.log(`Total scenario time: ${actualTimeTaken}ms (${expectedSeconds}s)`);
    console.log(`Displayed time: ${displayedTime}`);
    
    const displayedSeconds = this.parseDisplayedTime(displayedTime);
    expect(displayedSeconds).toBeGreaterThanOrEqual(expectedSeconds - 2);
    expect(displayedSeconds).toBeLessThanOrEqual(expectedSeconds + 2);
  }

  // Step processing methods
  public async processStep(
    step: string, 
    nextStepForHint: string, 
    previousStep: string, 
    testData: TestData
  ): Promise<void> {
    if (step === 'HINT') {
      if (previousStep !== 'NEXTSTEP') {
        await this.verifyHintPopup(nextStepForHint, testData);
      }
      return;
    }

    if (step.startsWith("S")) {
      await this.handleSingleSelectStep(step, previousStep, testData);
      return;
    }

    if (step.startsWith("TS")) {
      await this.handleTapAndTapStep(step, testData);
      return;
    }

    if (step === "NEXTSTEP") {
      await this.clickContinueButton();
      return;
    }
  }

  public async handleSingleSelectStep(
    step: string, 
    previousStep: string, 
    testData: TestData
  ): Promise<void> {
    const isFirstOccurrence = this.isFirstOccurrence(step);
    
    if (isFirstOccurrence) {
      if (previousStep === 'HINT') {
        await this.verifyHintPopup(step, testData);
      }
      await this.verifySingleSelectStep(step, testData);
    }
    
    await this.selectSingleSelectOptions(step, testData);
  }



  public async handleTapAndTapStep(step: string, testData: TestData): Promise<void> {
    await this.verifyStepInstruction(step, testData);
    await this.selectTapAndTapOptions(step, testData);
  }

  // Verification methods
  public async verifyHintPopup(step: string, testData: TestData): Promise<void> {
    const stepNumber = this.extractStepNumber(step);
    const stepDetails = testData['STEP_' + stepNumber] ;
    const actualStepNumber = stepNumber ? parseInt(stepNumber, 10) : null;
    console.log("StepNumber:"+actualStepNumber)
    if (actualStepNumber === null || !stepDetails?.hints) {
      throw new Error(`Invalid step format or missing hints: ${step}`);
    }

    const hintButtonIndex = actualStepNumber - 1;
    await this.hintButton.nth(hintButtonIndex).isVisible();
    await this.hintButton.nth(hintButtonIndex).isEnabled();
    await this.hintButton.nth(hintButtonIndex).click();
    
    await expect(this.hintTitle).toHaveText("Hint");

    // Handle different hint formats
    if ('ThinkAbout' in stepDetails.hints && 'AskYourself' in stepDetails.hints) {
      // Original format
      const thinkItems = await this.hintPopupThinkListItems.all();
      expect(thinkItems.length).toBe(stepDetails.hints.ThinkAbout!.length);
      
      const askItems = await this.hintPopupAskListItems.all();
      expect(askItems.length).toBe(stepDetails.hints.AskYourself!.length);
    }
    // For multi-select hints with individual keys, you might need different handling

    await this.popupContinueButton.nth(1).click();
  }

  public async verifyStepInstruction(step: string, testData: TestData): Promise<void> {
    const stepNumber = this.extractStepNumber(step);
    const stepDetails = testData["STEP_" + stepNumber] as StepData;
    
    await expect(this.stepDescription).toHaveText("Scenario Description");
    
    // Handle both string and array formats for instructions
    if (Array.isArray(stepDetails.instructions)) {
      await expect(this.stepInstruction).toHaveText(stepDetails.instructions[0]);
    } else {
      await expect(this.stepInstruction).toHaveText(stepDetails.instructions!);
    }
    
    await this.popupContinueButton.nth(1).click();
    
    if (stepDetails.instructionsList) {
      const instructionListItems = await this.stepInstructionList.all();
      for (let i = 0; i < stepDetails.instructionsList.length; i++) {
        await expect(instructionListItems[i]).toHaveText(stepDetails.instructionsList[i]);
      }
    }
  }

  public async verifySingleSelectStep(step: string, testData: TestData): Promise<void> {
    await this.verifyStepInstruction(step, testData);
    await this.verifySpeechBubbleConversation(step, testData);
    await this.verifyQuestion(step, testData);
    await this.verifySingleSelectOptions(step, testData);
  }



  public async verifyQuestion(step: string, testData: TestData): Promise<void> {
    const stepNumber = this.extractStepNumber(step);
    const stepDetails = testData['STEP_' + stepNumber] as StepData;
    const questionLocator = `.step-${stepNumber} h3`;
    
    await expect(this.frameLocator.locator(questionLocator)).toHaveText(stepDetails.question);
  }

  public async verifySingleSelectOptions(step: string, testData: TestData): Promise<void> {
    const stepNumber = this.extractStepNumber(step);
    const stepDetails = testData['STEP_' + stepNumber] as StepData;
    
    const optionSelectors = [
      `.step-${stepNumber} #slt_step_${stepNumber}_opt_1 .flip-card-front .card-text`,
      `.step-${stepNumber} #slt_step_${stepNumber}_opt_2 .flip-card-front .card-text`,
      `.step-${stepNumber} #slt_step_${stepNumber}_opt_3 .flip-card-front .card-text`
    ];
    
    const optionTexts = [stepDetails.INCORRECT_1!, stepDetails.CORRECT!, stepDetails.INCORRECT_2!];
    
    for (let i = 0; i < optionSelectors.length; i++) {
      await expect(this.frameLocator.locator(optionSelectors[i]).first()).toHaveText(optionTexts[i]);
    }
  }



  // Selection methods
  public async selectSingleSelectOptions(step: string, testData: TestData): Promise<void> {
    const stepNumber = this.extractStepNumber(step);
    const stepDetails = testData['STEP_' + stepNumber] as StepData;
    
    const { selectedOptionID, feedback } = this.determineSelectedOption(step, stepDetails);
    const optionSelector = `.step-${stepNumber} #slt_step_${stepNumber}_opt_${selectedOptionID}`;
    
    await this.frameLocator.locator(optionSelector).first().click();
    
    // Verify feedback
    const feedbackTextSelector = `${optionSelector} .flip-card-back .card-text`;
    const feedbackTitleSelector = `${optionSelector} .flip-card-back .card-title`;
    
    await expect(this.frameLocator.locator(feedbackTextSelector)).toHaveText(feedback.text);
    await expect(this.frameLocator.locator(feedbackTitleSelector)).toHaveText(feedback.title);
  }



  public determineSelectedOption(step: string, stepDetails: StepData): {
    selectedOptionID: number;
    feedback: { title: string; text: string };
  } {
    if (step.includes('_CORRECT')) {
      return { selectedOptionID: 2, feedback: stepDetails.feedback!.CORRECT! };
    } else if (step.includes('_INCORRECT_1')) {
      return { selectedOptionID: 1, feedback: stepDetails.feedback!.INCORRECT_1! };
    } else if (step.includes('_INCORRECT_2')) {
      return { selectedOptionID: 3, feedback: stepDetails.feedback!.INCORRECT_2! };
    } else {
      throw new Error(`Unknown step format: ${step}`);
    }
  }

  public async selectTapAndTapOptions(step: string, testData: TestData): Promise<void> {
    const stepNumber = this.extractStepNumber(step);
    const stepDetails = testData['STEP_' + stepNumber] as StepData;
    const actions = step.replace(/^TS9_/, "");
    const actionsToPerform = testData[actions] as string[];
    
    // Verify all options are displayed
    const options = [
      stepDetails.OPTION_1, stepDetails.OPTION_2, stepDetails.OPTION_3,
      stepDetails.OPTION_4, stepDetails.OPTION_5, stepDetails.OPTION_6
    ];
    
    for (let i = 0; i < options.length; i++) {
      const optionSelector = `#step_9_pickZone_1_section_1-option-${i + 1} > span`;
      // Uncomment if needed: await expect(this.frameLocator.locator(optionSelector).first()).toHaveText(options[i]!);
    }
    
    // Perform actions
    for (let i = 0; i < actionsToPerform.length; i++) {
      const action = actionsToPerform[i];
      
      if (action === 'HINT') {
        await this.verifyHintPopup(step, testData);
      } else if (action === 'CHECK') {
        await this.clickContinueButton();
        const isLastAction = i === actionsToPerform.length - 1;
        const feedback = isLastAction ? 
          stepDetails.feedback!.CORRECT! : 
          stepDetails.feedback!.INCORRECT!;
        await this.verifyFeedbackPopup(feedback, isLastAction);
      } else {
        await this.performTapAndTapAction(action);
      }
    }
  }

  public async performTapAndTapAction(action: string): Promise<void> {
    const [, optionNum, , slotNum] = action.split("_");
    const optionSelector = `#step_9_pickZone_1_section_1_opt_${optionNum}`;
    const slotSelector = `#step_9_dropZone_1_section_1-slot-${slotNum}`;
    const snapBackSelector = `#step_9_dropZone_1_section_1-slot-${slotNum}-snap-btn`;
    
    const slotLocator = this.frameLocator.locator(slotSelector);
    const isAvailable = await slotLocator.isEnabled();
    
    if (isAvailable) {
      await this.frameLocator.locator(snapBackSelector).click();
    }
    
    await this.frameLocator.locator(optionSelector).click();
    await this.frameLocator.locator(slotSelector).click();
  }

  public async verifyFeedbackPopup(
    feedback: { title: string; text: string }, 
    isCorrect: boolean
  ): Promise<void> {
    // await expect(this.frameLocator.locator('#dialog_desc .title')).toContainText(feedback.title);
    // await expect(this.frameLocator.locator('#dialog_desc > p')).toContainText(feedback.text);
    
    if (isCorrect) {
      await this.popupCloseButton.click();
    } else {
      const retryButton = this.frameLocator.locator('button[id*="retry"]');
      await retryButton.click();
    }
  }

  private async verifySpeechBubbleConversation(step: string, testData: TestData): Promise<void> {
    const stepNumber = this.extractStepNumber(step);
    const stepDetails = testData["STEP_" + stepNumber] as StepData;
    
    if (stepDetails.conversation && Array.isArray(stepDetails.conversation)) {
     // console.log('Speech bubble texts:', stepDetails.conversation);
      
      for (let i = 0; i < stepDetails.conversation.length; i++) {
        const characterName = stepDetails.conversation[i].title;
        const speechText = stepDetails.conversation[i].text;
        
        await expect(
          this.frameLocator.locator(`//strong[@class='name-title' and normalize-space()='${characterName}']/following-sibling::span[1]`).first()
        ).toHaveText(speechText);
      }
    }
  }
}