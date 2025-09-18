import { expect, type Page } from '@playwright/test';
import { SummaryReportActivitySix } from './summaryReportActivitySix.page';

export class SummaryReportActivityThree extends SummaryReportActivitySix {
   

   constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    super(page, iframeName);
    }

     public async runScenarioPathForActivityThree(path: string[], testData: any): Promise<void> {
        console.log('Starting Report Verification:', path);
        const result = this.splitByNextStep(path);
        for (let i = 0; i < result.length; i++) {  
            const step = result[i];
            const stepNumber =i +1;
            console.log(`Processing step ${i + 1}/${result.length}: ${step}`);  
            if(i=8){
                await this.verifySingleSelectReport(step,stepNumber,testData);
            }else{
                await this.verifyMultiSelectReport(step[0],stepNumber,testData);
            }
        }
        const hintUsed= this.countHintsUsed(path,testData);
        console.log("Actual no of Hint-"+ this.noOfHintUsed.innerText());
        console.log("Expected no of Hint-"+hintUsed.totalHintsUsed);
        await expect(this.noOfHintUsed).toHaveText(hintUsed.totalHintsUsed);
        await this.page.pause();
    }

    private async verifyMultiSelectReport( step:string, stepNumber: number, testData: any){
        await this.verifyInstruction(stepNumber, testData);
        await this.verifySupportingRationals(stepNumber, testData);
        await this.verifyUserActionDetailsFollowUpSteps(step,stepNumber,testData);
    }

   private async verifyUserActionDetailsFollowUpSteps(step:string,stepNumber: number,testData: any) {
    const stepDetails = testData['STEP_' + stepNumber];
    const stepData = stepDetails[step];
    const idealChoices = stepDetails.correctAnswers || [];
    const nonIdealChoices = stepDetails.incorrectAnswers || [];
    const dropdownNumber = stepNumber ? stepNumber - 1 : 1;
    for (let i = 0; i < stepData.length; i++) {
        let optionToClick: any;
        const actionPosition = i;
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