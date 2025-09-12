import { expect, FrameLocator, Locator, type Page } from '@playwright/test';

export class SummaryReportActivityThree {
    readonly page: Page;
    readonly finalScore: Locator;
    readonly firstAction: Locator;
    readonly noOfHintUsed: Locator;
    private readonly frameLocator: FrameLocator;

   constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.finalScore = page
        .frameLocator('iframe[name="ext_012345678_1"]')
        .locator("//strong[@class='score-value']")
        .first();
    
    // Initialize action locators - adjust selectors as needed
    this.firstAction = page.frameLocator('iframe[name="ext_012345678_1"]').locator('[data-testid="first-action"]');
    this.noOfHintUsed = page.frameLocator('iframe[name="ext_012345678_1"]').locator('strong.hint-value');
    }

    /**
     * Runs the scenario path for Activity Three in learning mode
     * @param path Array of steps to execute
     * @param testData Test data containing scene information
     */
    public async runScenarioPathForActivityThreeLearnigMode(path: string[], testData: any): Promise<void> {
        console.log('Starting Report Verification:', path);
        
        for (let i = 0; i < path.length; i++) {
            const step = path[i];
            const nextStep = i < path.length - 1 ? path[i + 1] : null;
            const previousStep = path[i-2] ;
            const previousStepForHint = path[i-1] ;
            
            console.log(`Processing step ${i + 1}/${path.length}: ${step}`);
            await this.processStep(step, nextStep, previousStep, testData,previousStepForHint);
        }
        const hintUsed= this.countHintsUsed(path,testData);
        console.log("Actual no of Hint-"+ this.noOfHintUsed.innerText());
        console.log("Expected no of Hint-"+hintUsed.totalHintsUsed);
        await expect(this.noOfHintUsed).toHaveText(hintUsed.totalHintsUsed);
        await this.page.pause();
    }

    /**
     * Processes an individual step based on its type
     */
    private async processStep(
        step: string, 
        nextStep: string | null, 
        previousStep: string, 
        testData: any,
        previousStepForHint:string
    ): Promise<void> {
        // Skip hint steps
        if (step === 'HINT') {
            console.log('Skipping HINT step');
            return;
        }

        // Skip next step markers
        if (step === 'NEXTSTEP') {
            console.log('Skipping NEXTSTEP marker');
            return;
        }

        // Handle main scene steps
        if (this.isMainSceneStep(step)) {
            await this.verifyMainSceneReport(step, previousStep, testData,previousStepForHint);
            return;
        }

        // Handle follow-up scene steps
        if (this.isFollowUpSceneStep(step)) {
            await this.verifyFollowUpSceneReport(step, previousStep, testData);
            return;
        }
    }

    /**
     * Checks if step is a main scene step
     */
    private isMainSceneStep(step: string): boolean {
        return step.startsWith("S");
    }

    /**
     * Checks if step is a follow-up scene step
     */
    private isFollowUpSceneStep(step: string): boolean {
        return step.startsWith("FS");
    }

    /**
     * Verifies main scene report elements
     */
    private async verifyMainSceneReport(
        step: string, 
        previousStep: string, 
        testData: any,
        previousStepForHint:string
    ){
        await this.verifyInstruction(step, testData);
        await this.verifySupportingRationals(step, testData);
        await this.verifyUserActionDetails(step, previousStepForHint, testData);
    }

    /**
     * Verifies follow-up scene report elements
     */
    private async verifyFollowUpSceneReport(step: string, previousStep: string, testData: any ){
        await this.verifyInstructionFollowUpScene(step, previousStep, testData);
        await this.verifySupportingRationalsForFollowUpStep(step,  testData);
        await this.verifyUserActionDetailsFollowUpSteps(step, previousStep, testData);
    }

    /**
     * Extracts step number from step string
     */
    private extractStepNumber(step: string) {
        const match = step.match(/(?:S|FS)(\d+)/);
        return match ? match[1] : "0";
    }

    /**
     * Verifies instruction text for main scenes
     */
    private async verifyInstruction(step: string, testData: any) {
        const stepNumber = this.extractStepNumber(step);
        const stepDetails = testData[`SCENE${stepNumber}`]
        const actualStepNumber = Number(stepNumber) * 2 - 1; 
        console.log("Started step:" +actualStepNumber);
        const instructionText = stepDetails.instructions;
        const questionText = stepDetails.decisionPoint.question;
        const dropdownNumber = actualStepNumber ? actualStepNumber - 1 : 1;
        if (dropdownNumber>0){
            await this.frameLocator.locator(`button#step-dropdown-arrow-button-${dropdownNumber}`).click();
        }
        const instructionHeadingLocator=`section#step-dropdown-${dropdownNumber}>div>div.description-container>.description-heading`
        const instructionLocator=`section#step-dropdown-${dropdownNumber}>div>div.description-container>.description-text`
        const questionTextLocator=`section#step-dropdown-${dropdownNumber}>div>div.description-container>.description-question`
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionHeadingLocator).first()).toHaveText("Description");
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionLocator).first()).toHaveText(instructionText);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(questionTextLocator).first()).toHaveText(questionText);
    }

    /**
     * Verifies instruction text for follow-up scenes
     */
    private async verifyInstructionFollowUpScene(step: string, previousStep: string, testData: any) {
        const stepNumber = this.extractStepNumber(step);
        const stepDetails = testData[`SCENE${stepNumber}`];
        const [sceneCode, ...optionParts] = previousStep.split('_');
        const optionKey = optionParts.join('_');
        console.log(optionKey);
        const followUpKey = this.mapOptionToFollowUpKey(optionKey);
        console.log(followUpKey);
        const followUpData = stepDetails.followUp?.[followUpKey];
        const instructionText = followUpData.instructions;
        const questionText = followUpData.question;
        const actualStepNumber = stepNumber ? parseInt(stepNumber, 10) * 2 : null;
        console.log("Started step:" +actualStepNumber);
        const dropdownNumber = actualStepNumber ? actualStepNumber - 1 : 1;
        if (dropdownNumber>0){
            await this.frameLocator.locator(`button#step-dropdown-arrow-button-${dropdownNumber}`).click();
        }
        const instructionHeadingLocator=`section#step-dropdown-${dropdownNumber}>div>div.description-container>.description-heading`
        const instructionLocator=`section#step-dropdown-${dropdownNumber}>div>div.description-container>.description-text`
        const questionTextLocator=`section#step-dropdown-${dropdownNumber}>div>div.description-container>.description-question`
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionHeadingLocator).first()).toHaveText("Description");
       await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionLocator).first()).toHaveText(instructionText);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(questionTextLocator).first()).toHaveText(questionText);
    }

    /**
     * Maps option keys to follow-up keys
     */
    private mapOptionToFollowUpKey(option: string): string {
        const normalizedOption = option.toUpperCase();
        
        switch (normalizedOption) {
            case 'INCORRECT_1':
                return 'nonIdealFollowUp1';
            case 'INCORRECT_2':
                return 'nonIdealFollowUp2';
            case 'CORRECT':
                return 'idealFollowUp';
            default:
                console.warn(`Unknown option: ${option}`);
                return '';
        }
    }

    /**
     * Verifies supporting rationals for main scenes
     */
    private async verifySupportingRationals(step: string, testData: any) {
        const stepNumber = this.extractStepNumber(step);
        const stepDetails = testData[`SCENE${stepNumber}`]
        const rational = stepDetails.rationalForReportMainScene;
        console.log(stepDetails);
        console.log(rational);
        const actualStepNumber = Number(stepNumber) * 2 - 1; 
        const dropdownNumber = actualStepNumber ? actualStepNumber - 1 : 1;
        const supportingRationalHeadingLocator=`section#step-dropdown-${dropdownNumber}>div>div.supporting-rationale-container>.supporting-rationale-heading`
        const supportingRationalTextLocator=`section#step-dropdown-${dropdownNumber}>div>div.supporting-rationale-container>.supporting-rationale-text`
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalHeadingLocator).first()).toHaveText("Supporting Rationale");
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextLocator).first()).toHaveText(rational);
        
    }

    /**
     * Verifies supporting rationals for follow-up steps
     */
    private async verifySupportingRationalsForFollowUpStep(
        step: string, 
        testData: any
    ){
        const stepNumber = this.extractStepNumber(step);
        const stepDetails = testData[`SCENE${stepNumber}`]
        const rational = stepDetails.rationaleForReportFollowUpScene;
        const actualStepNumber = stepNumber ? parseInt(stepNumber, 10) * 2 : null;
        const dropdownNumber = actualStepNumber ? actualStepNumber - 1 : 1;
        const supportingRationalHeadingLocator=`section#step-dropdown-${dropdownNumber}>div>div.supporting-rationale-container>.supporting-rationale-heading`
        const supportingRationalTextLocator=`section#step-dropdown-${dropdownNumber}>div>div.supporting-rationale-container>.supporting-rationale-text`
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalHeadingLocator).first()).toHaveText("Supporting Rationale");
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextLocator).first()).toHaveText(rational);
        
    }

  private async verifyUserActionDetails(
    step: string, 
    previousStep: string, 
    testData: any
) {
    const stepNumber = this.extractStepNumber(step);
    const stepDetails = testData[`SCENE${stepNumber}`];
    const actualStepNumber = Number(stepNumber) * 2 - 1; 
    const correctOptionText = stepDetails.decisionPoint.ideal;
    const incorrectOptionText = stepDetails.decisionPoint.nonIdeal1;
    const incorrectOptionText2 = stepDetails.decisionPoint.nonIdeal2;
    
    // Calculate the dropdown number based on actualStepNumber
    const dropdownNumber = actualStepNumber ? actualStepNumber - 1 : 1;
    
    // Helper function to create locators
    const createLocators = () => ({
        userActionLocator: `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-icon-text-container>.action-text`,
        userActionTextLocator: `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-description`
    });
    
    // Helper function to verify action expectations
    const verifyAction = async (actionPosition: number, expectedText: string, expectedDescription: string) => {
        const { userActionLocator, userActionTextLocator } = createLocators();
        await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText(expectedText);
        await expect(this.frameLocator.locator(userActionTextLocator).first()).toHaveText(expectedDescription);
    };
    
    // Helper function to get option text and expected action text based on step
    const getStepDetails = (step: string) => {
        if (step.includes('_CORRECT')) {
            return {
                optionText: correctOptionText,
                actionText: "Selected Correct Choice"
            };
        } else if (step.includes('_INCORRECT_1')) {
            return {
                optionText: incorrectOptionText,
                actionText: "Selected Incorrect Choice"
            };
        } else if (step.includes('_INCORRECT_2')) {
            return {
                optionText: incorrectOptionText2,
                actionText: "Selected Incorrect Choice"
            };
        } else {
            throw new Error(`Unknown step format: ${step}`);
        }
    };
    
    if (previousStep === "HINT") {
        // Verify hint action first
        const { userActionLocator, userActionTextLocator } = createLocators();
        //await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText(expectedText);
        await expect(this.frameLocator.locator(userActionLocator).first()).toHaveText("Selected Hint");
        
        // Verify the actual selection action
        const { optionText, actionText } = getStepDetails(step);
        await verifyAction(1, actionText, optionText);
    } else {
        // Verify the selection action directly
        const { optionText, actionText } = getStepDetails(step);
        await verifyAction(0, actionText, optionText);
    }
}

   private async verifyUserActionDetailsFollowUpSteps(
    step: string,
    previousStep: string,
    testData: any
) {
    const fsNumber = step.match(/FS(\d+)/)?.[1];
    const actualStepNumber = fsNumber ? parseInt(fsNumber, 10) * 2 : null;
    const stepDetails = testData['SCENE' + fsNumber];
    const stepData = stepDetails[step];
    const idealChoices = stepDetails.followUp.correctAnswers || [];
    const nonIdealChoices = stepDetails.followUp.incorrectAnswers || [];
    const dropdownNumber = actualStepNumber ? actualStepNumber - 1 : 1;
    for (let i = 0; i < stepData.length; i++) {
        let optionToClick: any;
        
        const actionPosition = i;
        
        // Dynamic locators
        const userActionLocator = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-icon-text-container>.action-text`;
        const userActionTextLocator = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-description`;
        
        if (stepData[i].startsWith("CORRECT")) {
            const correctIndex = parseInt(stepData[i].split("_")[1]) - 1;
            if (correctIndex >= 0 && correctIndex < idealChoices.length) {
                optionToClick = idealChoices[correctIndex];
                console.log(optionToClick);
                await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText("Selected Correct Choice");
                await expect(this.frameLocator.locator(userActionTextLocator).nth(actionPosition)).toHaveText(optionToClick);
            }
        } else if (stepData[i].startsWith("INCORRECT")) {
            const incorrectIndex = parseInt(stepData[i].split("_")[1]) - 1;
            if (incorrectIndex >= 0 && incorrectIndex < nonIdealChoices.length) {
                optionToClick = nonIdealChoices[incorrectIndex];
                await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText("Selected Incorrect Choice");
                await expect(this.frameLocator.locator(userActionTextLocator).nth(actionPosition)).toHaveText(optionToClick);
            }
        } else if (stepData[i].startsWith("HINT")) {
            await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText("Selected Hint");
        }
    }
}

private countHintsUsed(path: string[], testData: Record<string, Record<string, string[]>>): { 
  mainPathHints: string; 
  fsHintsUsed: string; 
  totalHintsUsed: string; 
} {
  let mainHintCount = 0;
  let fsHintsCount = 0;

  // Helper to count grouped/consecutive HINTs as one
  const countGroupedHints = (array: string[]): number => {
    let count = 0;
    let previousWasHint = false;

    for (let item of array) {
      if (item === "HINT") {
        if (!previousWasHint) {
          count++;
          previousWasHint = true;
        }
      } else {
        previousWasHint = false;
      }
    }

    return count;
  };

  // Count grouped HINTs in the main path
  mainHintCount = countGroupedHints(path);

  // Loop through the path to check FS steps and their hint usage
  for (let step of path) {
    if (step.startsWith("FS")) {
      const fsNumber = step.match(/FS(\d+)/)?.[1];
      if (fsNumber) {
        const stepDetails = testData['SCENE' + fsNumber];
        const stepData = stepDetails?.[step];

        if (Array.isArray(stepData)) {
          fsHintsCount += countGroupedHints(stepData);
        }
      }
    }
  }

  // Format counts as two-digit strings
  const formatCount = (count: number): string => count.toString().padStart(2, '0');

  return {
    mainPathHints: formatCount(mainHintCount),
    fsHintsUsed: formatCount(fsHintsCount),
    totalHintsUsed: formatCount(mainHintCount + fsHintsCount)
  };
}

  
}