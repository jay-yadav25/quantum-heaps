import { expect, FrameLocator, Locator, type Page } from '@playwright/test';

export class SummaryReportActivityThree {
    readonly page: Page;
    readonly finalScore: Locator;
    readonly firstAction: Locator;
    readonly secondAction: Locator;
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
    this.secondAction = page.frameLocator('iframe[name="ext_012345678_1"]').locator('[data-testid="second-action"]');
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
            const previousStep = path[i - 2] ;
            
            console.log(`Processing step ${i + 1}/${path.length}: ${step}`);
            await this.processStep(step, nextStep, previousStep, testData);
        }
    }

    /**
     * Processes an individual step based on its type
     */
    private async processStep(
        step: string, 
        nextStep: string | null, 
        previousStep: string, 
        testData: any
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
            await this.verifyMainSceneReport(step, previousStep, testData);
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
        testData: any
    ){
        await this.verifyInstruction(step, testData);
        await this.verifySupportingRationals(step, testData);
        await this.verifyUserActionDetails(step, previousStep, testData);
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
        const dropdownNumber = actualStepNumber ? actualStepNumber - 1 : 1;
        if (dropdownNumber>0){
            await this.frameLocator.locator(`button#step-dropdown-arrow-button-${dropdownNumber}`).click();
        }
        const instructionHeadingLocator=`section#step-dropdown-${dropdownNumber}>div>div.description-container>.description-heading`
        const instructionLocator=`section#step-dropdown-${dropdownNumber}>div>div.description-container>.description-text`
        const questionTextLocator=`section#step-dropdown-${dropdownNumber}>div>div.description-container>.description-question`
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionHeadingLocator).first()).toHaveText("User Action Details");
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

    /**
     * Verifies user action details based on previous step
     */
    // private async verifyUserActionDetails(
    //     step: string, 
    //     previousStep: string, 
    //     testData: any
    // ){const stepNumber = this.extractStepNumber(step);
    //     const stepDetails = testData[`SCENE${stepNumber}`];
    //     const actualStepNumber = Number(stepNumber) * 2 - 1; 
    //     const correctOptionText = stepDetails.decisionPoint.ideal;
    // const incorrectOptionText = stepDetails.decisionPoint.nonIdeal1;
    // const incorrectOptionText2 = stepDetails.decisionPoint.nonIdeal2;
    // // Calculate the dropdown number based on actualStepNumber
    //     const dropdownNumber = actualStepNumber ? actualStepNumber - 1 : 1;
      
    //         if (previousStep === "HINT") {
    //             const hintActionPosition = 1;
    //             const actionPosition = 2;
    //             const userActionLocator = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${hintActionPosition})>.action-icon-text-container>.action-text`;
    //     const userActionTextLocator = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${actionPosition})>.action-description`;
        
    //             await expect(this.frameLocator.locator(userActionLocator)).toHaveText("Selected Hint");
                
    // if (step.includes('_CORRECT')) {

    //      const userActionLocator1 = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${actionPosition})>.action-icon-text-container>.action-text`;
    //     const userActionTextLocator1 = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${actionPosition})>.action-description`;
        
    //     await expect(this.frameLocator.locator(userActionLocator1)).toHaveText("Selected Correct");
    //    await expect(this.frameLocator.locator(userActionTextLocator1)).toHaveText(correctOptionText);
    // } else if (step.includes('_INCORRECT_1')) {
    //      const userActionLocator1 = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${actionPosition})>.action-icon-text-container>.action-text`;
    //     const userActionTextLocator1 = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${actionPosition})>.action-description`;
        
    //     await expect(this.frameLocator.locator(userActionLocator1)).toHaveText("Selected Correct");
    //    await expect(this.frameLocator.locator(userActionTextLocator1)).toHaveText(incorrectOptionText);
    // } else if (step.includes('_INCORRECT_2')) {
    //      const userActionLocator1 = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${actionPosition})>.action-icon-text-container>.action-text`;
    //     const userActionTextLocator1 = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${actionPosition})>.action-description`;
        
    //     await expect(this.frameLocator.locator(userActionLocator1)).toHaveText("Selected Correct");
    //    await expect(this.frameLocator.locator(userActionTextLocator1)).toHaveText(incorrectOptionText2);
    // } else {
    //   throw new Error(`Unknown step format: ${step}`);
    // }

    //         } else {
    //             const actionPosition = 1;
    //             const userActionLocator = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${actionPosition})>.action-icon-text-container>.action-text`;
    //     const userActionTextLocator = `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper:nth-child(${actionPosition})>.action-description`;
    //             if (step.includes('_CORRECT')) {
    //                await expect(this.frameLocator.locator(userActionLocator)).toHaveText("Selected Correct");
    //    await expect(this.frameLocator.locator(userActionTextLocator)).toHaveText(correctOptionText);
    // } else if (step.includes('_INCORRECT_1')) {
    //     await expect(this.frameLocator.locator(userActionLocator)).toHaveText("Selected Correct");
    //    await expect(this.frameLocator.locator(userActionTextLocator)).toHaveText(incorrectOptionText);
    // } else if (step.includes('_INCORRECT_2')) {
    //    await expect(this.frameLocator.locator(userActionLocator)).toHaveText("Selected Correct");
    //    await expect(this.frameLocator.locator(userActionTextLocator)).toHaveText(incorrectOptionText2);
    // } else {
    //   throw new Error(`Unknown step format: ${step}`);
    // }
    //         }
    //     } 
    

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
    const createLocators = (actionPosition: number) => ({
        userActionLocator: `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-icon-text-container>.action-text`,
        userActionTextLocator: `section#step-dropdown-${dropdownNumber}>div>div.user-action-details-container>.all-action-wrapper>.action-wrapper>.action-description`
    });
    
    // Helper function to verify action expectations
    const verifyAction = async (actionPosition: number, expectedText: string, expectedDescription: string) => {
        const { userActionLocator, userActionTextLocator } = createLocators(actionPosition);
        await expect(this.frameLocator.locator(userActionLocator)).toHaveText(expectedText);
        await expect(this.frameLocator.locator(userActionTextLocator)).toHaveText(expectedDescription);
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
        await verifyAction(1, "Selected Hint", "");
        
        // Verify the actual selection action
        const { optionText, actionText } = getStepDetails(step);
        await verifyAction(2, actionText, optionText);
    } else {
        // Verify the selection action directly
        const { optionText, actionText } = getStepDetails(step);
        await verifyAction(1, actionText, optionText);
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
        
        // Calculate the dropdown number based on actualStepNumber
        
        // Calculate the action wrapper position (1-based index)
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

  
}