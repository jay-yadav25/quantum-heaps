import { expect, FrameLocator, Locator, type Page } from '@playwright/test';

export class SummaryReportActivitySix {
    readonly page: Page;
    readonly finalScore: Locator;
    readonly noOfHintUsed: Locator;
   public readonly frameLocator: FrameLocator;

   constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.finalScore = page
        .frameLocator('iframe[name="ext_012345678_1"]')
        .locator("//strong[@class='score-value']")
        .first();
    
    this.noOfHintUsed = page.frameLocator('iframe[name="ext_012345678_1"]').locator('strong.hint-value');
    }

    public async runScenarioPathForActivitySix(path: string[], testData: any): Promise<void> {
        console.log('Starting Report Verification:', path);
        const result = this.splitByNextStep(path);
        console.log(result);
        for (let i = 0; i < result.length; i++) {  
            const step = result[i];
            const stepNumber=i+1;
            console.log(`Processing step ${stepNumber}/${result.length}: ${step}`);  
            if(i===8){
                await this.verifyTapAndTapReport(step[0],stepNumber,testData);
            }else{
                await this.verifySingleSelectReport(step,stepNumber,testData);
            }
        }
        const hintUsed= this.countHintsUsed(path,testData);
        console.log("Actual no of Hint:"+  await this.noOfHintUsed.innerText());
        console.log("Expected no of Hint:"+hintUsed.totalHintsUsed);
        await expect(this.noOfHintUsed).toHaveText(hintUsed.totalHintsUsed);
       // await this.page.pause();
    }

    public splitByNextStep(steps: string[]): string[][] {
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
   
    
   public async verifySingleSelectReport( step:string[], stepNumber: number, testData: any){
        // await this.verifyInstruction(stepNumber, testData);
        // await this.verifySupportingRationals(stepNumber, testData);
        // await this.verifyUserActionDetailsForSingleSelect(step, stepNumber,testData);
    }

   public async verifyTapAndTapReport(step:string,stepNumber: number, testData: any){
        // await this.verifyInstruction(stepNumber, testData);
        // await this.verifySupportingRationals(stepNumber, testData);
        await this.verifyUserActionDetailsForTapAndTap(step, stepNumber,testData);
    }

    
   public async verifyInstruction(stepNumber: number, testData: any) {
        const stepDetails = testData[`STEP_${stepNumber}`]
        const instructionText = stepDetails.instructions;
        const questionText = stepDetails.question;
        if (stepNumber>1){
            //await this.page.pause();
            await this.frameLocator.locator(`button#step-dropdown-arrow-button-${stepNumber-1}`).click();
        }
        const instructionHeadingLocator=`section#step-dropdown-${stepNumber-1}>div>div.description-container>.description-heading`
        const instructionLocator=`section#step-dropdown-${stepNumber-1}>div>div.description-container>.description-text`
        const questionTextLocator=`section#step-dropdown-${stepNumber-1}>div>div.description-container>.description-question`
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionHeadingLocator).first()).toHaveText("Description");
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionLocator).first()).toHaveText(instructionText);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(questionTextLocator).first()).toHaveText(questionText);
    }

    
   public async verifySupportingRationals(stepNumber: number, testData: any) {
        const stepDetails = testData[`STEP_${stepNumber}`]
        const reportRational = stepDetails.reportRational;
        const supportingRationalHeadingLocator=`section#step-dropdown-${stepNumber-1}>div>div.supporting-rationale-container>.supporting-rationale-heading`
        const supportingRationalTextLocator=`section#step-dropdown-${stepNumber-1}>div>div.supporting-rationale-container>.supporting-rationale-text`
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalHeadingLocator).first()).toHaveText("Supporting Rationale");
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextLocator).first()).toHaveText(reportRational);
    }

   
 public async verifyUserActionDetailsForSingleSelect(
    step: string[], 
    stepNumber: number, 
    testData: any
) {
    const stepDetails = testData[`STEP_${stepNumber}`];
    //const stepData = stepDetails[step];
    const correctOptionText = stepDetails.CORRECT;
    const incorrectOptionText = stepDetails.INCORRECT_1;
    const incorrectOptionText2 = stepDetails.INCORRECT_2;
   
    const createLocators = () => ({
        userActionLocator: `section#step-dropdown-${stepNumber-1}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-icon-text-container>.action-text`,
        userActionTextLocator: `section#step-dropdown-${stepNumber-1}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-description`
    });
    
    // Helper function to verify action expectations
    const verifyAction = async (actionPosition: number,descriptionPosition:number, expectedText: string, expectedDescription: string) => {
        const { userActionLocator, userActionTextLocator } = createLocators();
        await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText(expectedText);
        await expect(this.frameLocator.locator(userActionTextLocator).nth(descriptionPosition)).toHaveText(expectedDescription);
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
    let descriptionPosition=0;
    for (let actionPosition=0; actionPosition<step.length;actionPosition++){ 
        
        if (step[actionPosition] === "HINT") {
            const { userActionLocator, userActionTextLocator } = createLocators();
            await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText("Selected Hint");
        } else {
            const { optionText, actionText } = getStepDetails(step[actionPosition]);
            await verifyAction(actionPosition,descriptionPosition, actionText, optionText);
            descriptionPosition=descriptionPosition+1;
        }
    }
}

public async verifyUserActionDetailsForTapAndTap(
    step: string,
    stepNumber: number,
    testData: any
) {
    const actionList = step.replace(/^TS9_/, "");
    const stepDetails = testData[`STEP_${stepNumber}`];
    const stepData=testData[actionList];
    console.log("ActionList"+actionList)
    const optionText_1 = stepDetails.OPTION_1;
    const optionText_2 = stepDetails.OPTION_2;
    const optionText_3 = stepDetails.OPTION_3;
    const optionText_4 = stepDetails.OPTION_4;
    const optionText_5 = stepDetails.OPTION_5;
    const optionText_6 = stepDetails.OPTION_6;

    const correctSequence = ["OPT_1_SLOT_1", "OPT_2_SLOT_2", "OPT_3_SLOT_3", "OPT_4_SLOT_4", "OPT_5_SLOT_5", "OPT_6_SLOT_6"];

    const createLocators = () => ({
        userActionLocator: `section#step-dropdown-${stepNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-icon-text-container>.action-text`,
        userActionTextLocator: `section#step-dropdown-${stepNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-description`
    });

    // Helper function to verify action expectations
    const verifyAction = async (actionPosition: number, expectedText: string, expectedDescription: string, attemptNumber?: number) => {
        const { userActionLocator, userActionTextLocator } = createLocators();
        // await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText(expectedText);
        // await expect(this.frameLocator.locator(userActionTextLocator).nth(actionPosition)).toHaveText(expectedDescription);
        
        // You can use attemptNumber for additional logging or assertions if needed
        if (attemptNumber !== undefined) {
            console.log(`Verifying action ${actionPosition} from attempt ${attemptNumber}: ${expectedText}`);
        }
    };

    // Helper function to get option text based on option
    const getOptionText = (option: string) => {
        switch (option) {
            case 'OPT_1': return optionText_1;
            case 'OPT_2': return optionText_2;
            case 'OPT_3': return optionText_3;
            case 'OPT_4': return optionText_4;
            case 'OPT_5': return optionText_5;
            case 'OPT_6': return optionText_6;
            default: return '';
        }
    };

    // Helper function to check if a step is correct
    const isStepCorrect = (stepAction: string) => {
        return correctSequence.includes(stepAction);
    };

    // Split the step array into attempts based on "CHECK"
    const attempts: Array<{hint?: boolean, actions: string[]}> = [];
    let currentAttempt: string[] = [];
    
    for (const action of stepData) {
        if (action === "CHECK") {
            if (currentAttempt.length > 0) {
                // Check if there's a HINT in this attempt
                const hasHint = currentAttempt.includes("HINT");
                const slotActions = currentAttempt.filter(a => a !== "HINT");
                
                attempts.push({
                    hint: hasHint,
                    actions: slotActions
                });
                currentAttempt = [];
            }
        } else {
            currentAttempt.push(action);
        }
    }

    // Process each attempt and build the complete action sequence
    let allActions: Array<{action: string, isCorrect: boolean, optionText: string, attemptNumber: number}> = [];
    let correctSlotsFromAllPreviousAttempts: string[] = [];

    for (let attemptIndex = 0; attemptIndex < attempts.length; attemptIndex++) {
        const attemptData = attempts[attemptIndex];
        const attempt = attemptData.actions;
        const hasHint = attemptData.hint;
        const currentAttemptNumber = attemptIndex + 1;
        
        // Add HINT at position 1 if present in this attempt
        if (hasHint) {
            allActions.push({
                action: "HINT",
                isCorrect: false,
                optionText: "Selected Hint",
                attemptNumber: currentAttemptNumber
            });
        }
        
        // Create a combined sequence with carry forward slots in correct positions
        const combinedSequence: Array<{action: string, isCorrect: boolean, optionText: string, attemptNumber: number}> = [];
        
        // First, add carried forward slots in their correct positions (1-6)
        const carriedForwardPositions = new Set();
        for (const correctSlot of correctSlotsFromAllPreviousAttempts) {
            const slotNumber = parseInt(correctSlot.split('_SLOT_')[1]);
            const option = correctSlot.split('_')[0] + '_' + correctSlot.split('_')[1];
            
            // Insert at correct position (slot number - 1 for 0-based indexing)
            combinedSequence[slotNumber - 1] = {
                action: correctSlot,
                isCorrect: true,
                optionText: getOptionText(option),
                attemptNumber: currentAttemptNumber // Carried forward but shown in current attempt
            };
            carriedForwardPositions.add(slotNumber);
        }

        // Then, add actions from current attempt in their positions
        for (const action of attempt) {
            const slotNumber = parseInt(action.split('_SLOT_')[1]);
            const option = action.split('_')[0] + '_' + action.split('_')[1];
            const isCorrect = isStepCorrect(action);
            
            // Only add if this position wasn't carried forward
            if (!carriedForwardPositions.has(slotNumber)) {
                combinedSequence[slotNumber - 1] = {
                    action: action,
                    isCorrect: isCorrect,
                    optionText: getOptionText(option),
                    attemptNumber: currentAttemptNumber
                };
            }
        }

        // Add the combined sequence to allActions (only non-empty positions)
        for (const actionData of combinedSequence) {
            if (actionData) {
                allActions.push(actionData);
            }
        }

        // Update carry forward list with correct actions from current attempt (accumulate from ALL previous attempts)
        for (const action of attempt) {
            const isCorrect = isStepCorrect(action);
            if (isCorrect && !correctSlotsFromAllPreviousAttempts.includes(action)) {
                correctSlotsFromAllPreviousAttempts.push(action);
            }
        }
    }
    console.log(allActions);
    // Verify all actions in the report
    for (let i = 0; i < allActions.length; i++) {
        const actionData = allActions[i];
        //console.log(actionData);
        
        //for (let i=0; i< actionData.length;i++)
        // if (actionData.action === "HINT") {
        //     await verifyAction(i, "Selected Hint", "Selected Hint", actionData.attemptNumber);
        // } else {
        //     const actionText = actionData.isCorrect ? "Selected Correct Choice" : "Selected Incorrect Choice";
        //     await verifyAction(i, actionText, actionData.optionText, actionData.attemptNumber);
        // }
    }
}
public countHintsUsed(path: string[], testData: Record<string, Record<string, string[]>>): { 
  mainPathHints: string; 
  fsHintsUsed: string; 
  totalHintsUsed: string; 
} {
  let mainHintCount = 0;
  let secondaryHintsCount = 0;

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
    if (!step.startsWith("S") && step !=="HINT" && step !=="NEXTSTEP") {
      const stepNumber = step.match(/MS(\d+)/)?.[1];
      const stepDetails = testData['STEP_' + stepNumber];
      const stepData = stepDetails[step];
      secondaryHintsCount += countGroupedHints(stepData);
        
      
    }
  }

  // Format counts as two-digit strings
  const formatCount = (count: number): string => count.toString().padStart(2, '0');

  return {
    mainPathHints: formatCount(mainHintCount),
    fsHintsUsed: formatCount(secondaryHintsCount),
    totalHintsUsed: formatCount(mainHintCount + secondaryHintsCount)
  };
}
}