import { expect, FrameLocator, Locator, type Page } from '@playwright/test';

export class SummaryReportActivitySix {
    readonly page: Page;
    readonly finalScore: Locator;
    readonly noOfHintUsed: Locator;
    private readonly frameLocator: FrameLocator;

   constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.finalScore = page
        .frameLocator('iframe[name="ext_012345678_1"]')
        .locator("//strong[@class='score-value']")
        .first();
    
    this.noOfHintUsed = page.frameLocator('iframe[name="ext_012345678_1"]').locator('strong.hint-value');
    }

    public async runScenarioPathForActivitySixLearnigMode(path: string[], testData: any): Promise<void> {
        console.log('Starting Report Verification:', path);
        const result = this.splitByNextStep(path);
        for (let i = 0; i < result.length; i++) {  
            const step = result[i];
            console.log(`Processing step ${i + 1}/${result.length}: ${step}`);  
            if(i=8){
                await this.verifySingleSelectReport(step,i+1,testData);
            }else{
                await this.verifyTapAndtapReport(step,i+1,testData);
            }
        }
        const hintUsed= this.countHintsUsed(path,testData);
        console.log("Actual no of Hint-"+ this.noOfHintUsed.innerText());
        console.log("Expected no of Hint-"+hintUsed.totalHintsUsed);
        await expect(this.noOfHintUsed).toHaveText(hintUsed.totalHintsUsed);
        await this.page.pause();
    }

    private splitByNextStep(steps: string[]): string[][] {
    const result: string[][] = [];
    let currentStep: string[] = [];
    
    for (let i = 0; i < steps.length; i++) {
        if (steps[i] === "NEXTSTEP") {
            if (currentStep.length > 0) {
                result.push([...currentStep]);
                currentStep = [];
            }
        } else {
            currentStep.push(steps[i]);
        }
    }
    
    if (currentStep.length > 0) {
        result.push(currentStep);
    }
    
    return result;
}
   
    
    private async verifySingleSelectReport( step:string[], stepNumber: number, testData: any){
        await this.verifyInstruction(stepNumber, testData);
        await this.verifySupportingRationals(stepNumber, testData);
        await this.verifyUserActionDetailsForSingleSelect(step, stepNumber,testData);
    }

    private async verifyTapAndtapReport(step:string[],stepNumber: number, testData: any){
        await this.verifyInstruction(stepNumber, testData);
        await this.verifySupportingRationals(stepNumber, testData);
        await this.verifyUserActionDetailsForSingleSelect(step, stepNumber,testData);
    }

    
    private async verifyInstruction(stepNumber: number, testData: any) {
        const stepDetails = testData[`STEP_${stepNumber}`]
        const instructionText = stepDetails.instructions;
        const questionText = stepDetails.question;
        if (stepNumber>1){
            await this.frameLocator.locator(`button#step-dropdown-arrow-button-${stepNumber}`).click();
        }
        const instructionHeadingLocator=`section#step-dropdown-${stepNumber}>div>div.description-container>.description-heading`
        const instructionLocator=`section#step-dropdown-${stepNumber}>div>div.description-container>.description-text`
        const questionTextLocator=`section#step-dropdown-${stepNumber}>div>div.description-container>.description-question`
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionHeadingLocator).first()).toHaveText("Description");
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionLocator).first()).toHaveText(instructionText);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(questionTextLocator).first()).toHaveText(questionText);
    }

    
    private async verifySupportingRationals(stepNumber: number, testData: any) {
        const stepDetails = testData[`STEP_${stepNumber}`]
        const rational = stepDetails.rationalForReport;
        const supportingRationalHeadingLocator=`section#step-dropdown-${stepNumber}>div>div.supporting-rationale-container>.supporting-rationale-heading`
        const supportingRationalTextLocator=`section#step-dropdown-${stepNumber}>div>div.supporting-rationale-container>.supporting-rationale-text`
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalHeadingLocator).first()).toHaveText("Supporting Rationale");
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextLocator).first()).toHaveText(rational);
    }

   
  private async verifyUserActionDetailsForSingleSelect(
    step: string[], 
    stepNumber: number, 
    testData: any
) {
    const stepDetails = testData[`STEP_${stepNumber}`];
    const correctOptionText = stepDetails.CORRECT;
    const incorrectOptionText = stepDetails.INCORRECT_1;
    const incorrectOptionText2 = stepDetails.INCORRECT_2;
   
    const createLocators = () => ({
        userActionLocator: `section#step-dropdown-${stepNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-icon-text-container>.action-text`,
        userActionTextLocator: `section#step-dropdown-${stepNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-description`
    });
    
    // Helper function to verify action expectations
    const verifyAction = async (actionPosition: number, expectedText: string, expectedDescription: string) => {
        const { userActionLocator, userActionTextLocator } = createLocators();
        await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText(expectedText);
        await expect(this.frameLocator.locator(userActionTextLocator).nth(actionPosition)).toHaveText(expectedDescription);
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
    for (let i=0; i<step.length;i++){ 
        const actionPosition=i;
        if (step[i] === "HINT") {
            // Verify hint action first
            const { userActionLocator, userActionTextLocator } = createLocators();
            await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText("Selected Hint");
        } else {
            const { optionText, actionText } = getStepDetails(step[i]);
            await verifyAction(i, actionText, optionText);
        }
    }
}

   private async verifyUserActionDetailsForTapAndTap(
    step: string[], 
    stepNumber: number, 
    testData: any
) {
    const stepDetails = testData[`STEP_${stepNumber}`];
    const optionText_1= stepDetails.OPTION_1;
    const optionText_2= stepDetails.OPTION_2;
    const optionText_3= stepDetails.OPTION_3;
    const optionText_4= stepDetails.OPTION_4;
    const optionText_5= stepDetails.OPTION_5;
    const optionText_6= stepDetails.OPTION_6;
   
    const createLocators = () => ({
        userActionLocator: `section#step-dropdown-${stepNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-icon-text-container>.action-text`,
        userActionTextLocator: `section#step-dropdown-${stepNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-description`
    });
    
    // Helper function to verify action expectations
    const verifyAction = async (actionPosition: number, expectedText: string, expectedDescription: string) => {
        const { userActionLocator, userActionTextLocator } = createLocators();
        await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText(expectedText);
        await expect(this.frameLocator.locator(userActionTextLocator).nth(actionPosition)).toHaveText(expectedDescription);
    };
    
    // Helper function to get option text and expected action text based on step
    const getStepDetails = (step: string) => {
        if (step.includes('_CORRECT')) {
            return {
                optionText: optionText_1,
                actionText: "Selected Correct Choice"
            };
        } else if (step.includes('_INCORRECT_1')) {
            return {
                optionText: optionText_1,
                actionText: "Selected Incorrect Choice"
            };
        } else if (step.includes('_INCORRECT_2')) {
            return {
                optionText: optionText_1,
                actionText: "Selected Incorrect Choice"
            };
        } else {
            throw new Error(`Unknown step format: ${step}`);
        }
    };
    for (let i=0; i<step.length;i++){ 
        const actionPosition=i;
        if (step[i] === "HINT") {
            // Verify hint action first
            const { userActionLocator, userActionTextLocator } = createLocators();
            await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText("Selected Hint");
        } else {
            const { optionText, actionText } = getStepDetails(step[i]);
            await verifyAction(i, actionText, optionText);
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