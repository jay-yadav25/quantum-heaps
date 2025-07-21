import { expect, Locator, type Page } from '@playwright/test';

export class SummaryReportActivityThree {
    readonly page: Page;
    readonly finalScore: Locator;
    readonly firstAction: Locator;
    readonly secondAction: Locator;

    constructor(page: Page) {
        this.page = page;
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
            const previousStep = path[i - 1] ;
            
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
        await this.verifySupportingRationals(step,  testData);
        await this.verifyUserActionDetails(step, previousStep, testData);
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
        const instructionText = stepDetails.instructions;
        const instructionLocator=""
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionLocator)).toHaveText(instructionText);
    }

    /**
     * Verifies instruction text for follow-up scenes
     */
    private async verifyInstructionFollowUpScene(step: string, previousStep: string, testData: any) {
        const stepNumber = this.extractStepNumber(step);
        const stepDetails = testData[`SCENE${stepNumber}`];
        const [sceneCode, ...optionParts] = previousStep.split('_');
        const optionKey = optionParts.join('_');
        const followUpKey = this.mapOptionToFollowUpKey(optionKey);
        const followUpData = stepDetails.followUp?.[followUpKey];
        const instructionText = followUpData.instructions;
        console.log(`Verifying follow-up instruction for step ${step}: ${instructionText}`);
        const instructionLocator=""
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionLocator)).toHaveText(instructionText);
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
        const rational = stepDetails.rationaleForReport;
        const rationalLocator=''
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(rationalLocator)).toHaveText(rational);
    }

    /**
     * Verifies supporting rationals for follow-up steps
     */
    // private async verifySupportingRationalsForFollowUpStep(
    //     step: string, 
    //     stepDetails: any, 
    //     testData: any
    // ){
    //     const rational = stepDetails.rationaleForReportFollowUpScene;
    //     if (!rational) {
    //         console.warn(`No follow-up rationale found for step ${step}`);
    //         return;
    //     }

    //     // TODO: Implement actual locator and assertion
    //     console.log(`Verifying follow-up rationale for step ${step}: ${rational}`);
    //     // await expect(rationaleLocator).toHaveText(rational);
    // }

    /**
     * Verifies user action details based on previous step
     */
    private async verifyUserActionDetails(
        step: string, 
        previousStep: string, 
        testData: any
    ){const stepNumber = this.extractStepNumber(step);
        const stepDetails = testData[`SCENE${stepNumber}`]
        const correctOptionText = stepDetails.decisionPoint.ideal;
    const incorrectOptionText = stepDetails.decisionPoint.nonIdeal1;
    const incorrectOptionText2 = stepDetails.decisionPoint.nonIdeal2;
      
            if (previousStep === "HINT") {
                await expect(this.firstAction).toHaveText("Selected Hint");
                // TODO: Implement second action verification based on step
                await expect(this.secondAction).toHaveText("expectedSecondActionText");
                
    if (step.includes('_CORRECT')) {
        await expect(this.firstAction).toHaveText("expectedFirstActionText");
       await expect(this.secondAction).toHaveText(correctOptionText);
    } else if (step.includes('_INCORRECT_1')) {
        await expect(this.firstAction).toHaveText("expectedFirstActionText");
       await expect(this.secondAction).toHaveText(incorrectOptionText);
    } else if (step.includes('_INCORRECT_2')) {
        await expect(this.firstAction).toHaveText("expectedFirstActionText");
      await expect(this.secondAction).toHaveText(incorrectOptionText2);
    } else {
      throw new Error(`Unknown step format: ${step}`);
    }

            } else {

                await expect(this.firstAction).toHaveText("expectedFirstActionText");
                //await expect(this.secondAction).toHaveText("expectedSecondActionText");
                if (step.includes('_CORRECT')) {
                    await expect(this.firstAction).toHaveText("expectedFirstActionText");
       await expect(this.secondAction).toHaveText(correctOptionText);
    } else if (step.includes('_INCORRECT_1')) {
        await expect(this.firstAction).toHaveText("expectedFirstActionText");
       await expect(this.secondAction).toHaveText(incorrectOptionText);
    } else if (step.includes('_INCORRECT_2')) {
        await expect(this.firstAction).toHaveText("expectedFirstActionText");
      await expect(this.secondAction).toHaveText(incorrectOptionText2);
    } else {
      throw new Error(`Unknown step format: ${step}`);
    }
            }
        } 
    

   private async verifyUserActionDetailsFollowUpSteps(
    step: string,
    previousStep: string,
    testData: any
) {
    const fsNumber = step.match(/FS(\d+)/)?.[1];
    const stepDetails = testData['SCENE' + fsNumber];
    const stepData = stepDetails[step];

    // if (!stepData) {
    //     console.log(`No data found for step: ${step}`);
    //     return;
    // }

    const idealChoices = stepDetails.followUp.correctAnswers || [];
    const nonIdealChoices = stepDetails.followUp.incorrectAnswers || [];

    for (let i = 0; i < stepData.length; i++) {
        let optionToClick: any;

        if (stepData[i].startsWith("CORRECT")) {
            const correctIndex = parseInt(stepData[i].split("_")[1]) - 1;
            if (correctIndex >= 0 && correctIndex < idealChoices.length) {
                optionToClick = idealChoices[correctIndex];
                await expect(this.firstAction).toHaveText("Selected Correct");
                await expect(this.firstAction).toHaveText(optionToClick);
            }
        } else if (stepData[i].startsWith("INCORRECT")) {
            const incorrectIndex = parseInt(stepData[i].split("_")[1]) - 1;
            if (incorrectIndex >= 0 && incorrectIndex < nonIdealChoices.length) {
                optionToClick = nonIdealChoices[incorrectIndex];
                await expect(this.firstAction).toHaveText("Selected Correct");
                await expect(this.firstAction).toHaveText(optionToClick);
            }
        } else if (stepData[i].startsWith("HINT")) {
            await expect(this.firstAction).toHaveText("Selected Hint");

        }

    }
}

  
}