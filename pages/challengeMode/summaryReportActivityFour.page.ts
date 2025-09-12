import { expect, FrameLocator, Locator, type Page } from '@playwright/test';

export class SummaryReportActivityFour {
    readonly page: Page;
    readonly finalScore: Locator;
    readonly attemptTwo: Locator;
    readonly attemptOne: Locator;
    readonly overallScore: Locator;
    private readonly frameLocator: FrameLocator;
    readonly attemptScore:Locator;
    
    // Array to store scores for each attempt
    private scoresArray: number[][] = [];
    private currentAttemptScores: number[] = [];
    private attemptAverages: number[] = [];
    private highestAttemptAverage: number = 0;
    

   constructor(page: Page, iframeName: string = 'ext_012345678_1') {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);
    this.finalScore = page
        .frameLocator('iframe[name="ext_012345678_1"]')
        .locator("//strong[@class='score-value']")
        .first();
    
    // Initialize action locators - adjust selectors as needed
    this.attemptTwo = page.frameLocator('iframe[name="ext_012345678_1"]').locator('#attempt-dropdown-arrow-button-1');
    this.attemptOne = page.frameLocator('iframe[name="ext_012345678_1"]').locator('#attempt-dropdown-arrow-button-0');
    
    this.overallScore = page.frameLocator('iframe[name="ext_012345678_1"]').locator('strong.score-value');
    this.attemptScore = page.frameLocator('iframe[name="ext_012345678_1"]').locator('div.score-value');
    }

    public async runScenarioPathForActivityFourChallengeMode(path: string[], testData: any): Promise<void> {
        console.log('Starting Report Verification:', path);
        
        this.scoresArray = [];
        this.currentAttemptScores = [];
        this.attemptAverages = [];
        this.highestAttemptAverage = 0;
        let attemptNumber=0;
        for (let i = 0; i < path.length; i++) {
            const step = path[i];
            
            if (step === 'NEXTSTEP') {
                console.log('Skipping NEXTSTEP marker');
                continue;
            }
            if (step === 'SUBMIT') {
                console.log('Skipping SUBMIT marker');
                continue;
            }
   
            if (step === 'RESTART') {
                console.log('REATTEMPT detected - storing current attempt scores');
                await this.attemptOne.click();
                await this.attemptTwo.click();
                attemptNumber=1;
                await this.handleReattempt();
                continue;
            }
            
            console.log(`Processing step ${i + 1}/${path.length}: ${step}`);
            await this.processStep(step, testData,attemptNumber);
        }
        
        if (this.currentAttemptScores.length > 0) {
            this.scoresArray.push([...this.currentAttemptScores]);
        }
        
        // Calculate averages and find highest
        this.calculateAveragesAndHighest();
        
        console.log('Final scores array:', this.scoresArray);
        console.log('Attempt averages:', this.attemptAverages);
         const avgScores = this.attemptAverages;
         const overallSocre = this.highestAttemptAverage;
         const firstEntry = avgScores[0];
        const secondEntry = avgScores[1];
        await expect((this.attemptScore).nth(0)).toHaveText(": "+firstEntry.toString()+"%");
        if(avgScores.length>1){
             await expect((this.attemptScore).nth(1)).toHaveText(": "+secondEntry.toString()+"%");
        }
        await expect((this.overallScore)).toHaveText(overallSocre.toString()+"%");

        console.log('Highest attempt average:', this.highestAttemptAverage);
        await this.page.pause();
    }

    /**
     * Handles reattempt logic - stores current scores and resets for new attempt
     */
    private handleReattempt(): void {
        if (this.currentAttemptScores.length > 0) {
            this.scoresArray.push([...this.currentAttemptScores]);
            this.currentAttemptScores = [];
            console.log('Stored attempt scores. Current scores array:', this.scoresArray);
        }
    }

    /**
     * Calculates averages for each attempt and finds the highest average
     */
    private calculateAveragesAndHighest(): void {
        this.attemptAverages = [];
        this.highestAttemptAverage = 0;
        
        for (let i = 0; i < this.scoresArray.length; i++) {
            const attempt = this.scoresArray[i];
            if (attempt.length > 0) {
                const average = (attempt.reduce((sum, score) => sum + score, 0) / attempt.length)*100;
                this.attemptAverages.push(average);
                
                if (average > this.highestAttemptAverage) {
                    this.highestAttemptAverage = average;
                }
            }
        }
        
        console.log(`Calculated ${this.attemptAverages.length} attempt averages:`, this.attemptAverages);
        console.log('Highest attempt average:', this.highestAttemptAverage);
    }

    /**
     * Gets the stored scores array
     */
    public getScoresArray(): number[][] {
        return this.scoresArray;
    }

    /**
     * Gets the current attempt scores
     */
    public getCurrentAttemptScores(): number[] {
        return this.currentAttemptScores;
    }

    /**
     * Gets the averages for each attempt
     */
    public getAttemptAverages(): number[] {
        return this.attemptAverages;
    }

    /**
     * Gets the highest attempt average
     */
    public getHighestAttemptAverage(): number {
        return this.highestAttemptAverage;
    }

    /**
     * Gets a summary of all attempt statistics
     */
    public getAttemptSummary(): {
        scoresArray: number[][];
        attemptAverages: number[];
        highestAttemptAverage: number;
        totalAttempts: number;
    } {
        return {
            scoresArray: this.scoresArray,
            attemptAverages: this.attemptAverages,
            highestAttemptAverage: this.highestAttemptAverage,
            totalAttempts: this.scoresArray.length
        };
    }

     private extractStatuses(steps: string): string[] {
  const firstUnderscoreIndex = steps.indexOf("_");
  if (firstUnderscoreIndex === -1) return [];

  // Remove the step prefix and split the rest
  const parts = steps.slice(firstUnderscoreIndex + 1).split("_");

  // Group every 2 parts into a single status (e.g., INCORRECT_1)
  const result: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    if (parts[i + 1] !== undefined) {
      result.push(parts[i] + "_" + parts[i + 1]);
    } else {
      // Handle the last unpaired element
      result.push(parts[i]);
    }
  }

  return result;
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
    /**
     * Processes an individual step based on its type
     */
    private async processStep(
        step: string, 
        testData: any,
        attemptNumber:number
    ): Promise<void> {
    let score=0;
    const StepsInvolved =this.extractStatuses(step); 
    
    
    if (StepsInvolved.length==1 && StepsInvolved[0]=="CORRECT"){
        score=1;
    }else if (StepsInvolved.length==1 && StepsInvolved[0]!="CORRECT"){
        score=0; 
    }else if (StepsInvolved.length==2 && StepsInvolved[1]=="CORRECT"){
        score=0.5;
    }else if (StepsInvolved.length>=2){
        score=0; 
    }else {
        score=0;
    }
    
    // Add score to current attempt
    this.currentAttemptScores.push(score);
    console.log(`Step: ${step}, Score: ${score}, StepsInvolved: [${StepsInvolved.join(', ')}], Current attempt scores:`, this.currentAttemptScores);
    
    await this.verifyReportContentAndScore(step, StepsInvolved, score, testData,attemptNumber);
    }

    /**
     * Checks if step is a main scene step
     */
    
    private async verifyReportContentAndScore(
        step: string, 
        StepsInvolved:string[],
        score:number, 
        testData: any,
        attemptNumber:number
    ){
    let sceneLevel='';
    let actualStepNumber:number=0;
    if (step.startsWith('S')) {
      const stepNumber = step.match(/S(\d+)/)?.[1];
      sceneLevel =`${stepNumber}`;
      actualStepNumber=Number(stepNumber);
      
    } else if (step.startsWith('C')) {
      const match = step.match(/^C(\d+)\.(\d+)_/);
      if (match) {
        const [_, major, minor] = match;
        sceneLevel = `${major}_${minor}`;
        actualStepNumber=Number(major);
      }
    }else if (step.startsWith('M')) {
        const match = step.match(/^M(\d+)\.(\d+)_/);
        if (match) {
          const [_, major, minor] = match;
          sceneLevel = `${major}_${minor}`;
          actualStepNumber=Number(major);
        }
    }
       await this.verifyInstruction(step,StepsInvolved,actualStepNumber,sceneLevel, testData,attemptNumber);
      if (step.startsWith('M')){
            await this.verifyUserActionDetailsMultiSelect(step,StepsInvolved,actualStepNumber,sceneLevel, testData,attemptNumber);
             await this.verifySupportingRationalsForMultiselect(step,StepsInvolved,actualStepNumber,sceneLevel, testData,attemptNumber,score);
      
       }else{
             await this.verifyUserActionDetails(step,StepsInvolved,actualStepNumber,sceneLevel, testData,attemptNumber);
              await this.verifySupportingRationals(step,StepsInvolved,actualStepNumber,sceneLevel, testData,attemptNumber,score);
       }
      
    }



    private async verifyInstruction(step: string,StepsInvolved:string[],actualStepNumber:number,sceneLevel:string, testData: any,attemptNumber:number) {
        const stepDetails = testData[`STEP_${sceneLevel}`]
        console.log("Started step:" +actualStepNumber);
        const instructionText = stepDetails.instruction;
        const questionText = stepDetails.question;
        const dropdownNumber = actualStepNumber - 1;
        if (dropdownNumber>0){
            await this.frameLocator.locator(`button#step-dropdown-arrow-button-${dropdownNumber}`).nth(attemptNumber).click();
        }
        const baseLocator=`//*[@id='attempt-dropdown-arrow-button-${attemptNumber}']/parent::*/parent::div[contains(@class, 'attempt-heading-container')]/following-sibling::section//section`;
        const instructionHeadingLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'description-container')]/*[contains(@class,'description-heading')]`;
        const instructionLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'description-container')]/*[contains(@class,'description-text')]`;
         const questionTextLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'description-container')]/*[contains(@class,'description-question')]`;
        
         await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionHeadingLocator)).toHaveText("Description");
        const noOfInstructionItems = await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionLocator).all();
        for (let i = 0; i < instructionText.length; i++) {
            await expect(noOfInstructionItems[i]).toHaveText(instructionText[i]);
        } 
        //await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(questionTextLocator)).toHaveText(questionText);
    }


    
    private async verifySupportingRationals(step: string,StepsInvolved:string[],actualStepNumber:number,sceneLevel:string, testData: any,attemptNumber:number,score:number) {
       let feedbackText='';
       let feedbackTextTitle=''
        const stepDetails = testData[`STEP_${sceneLevel}`];
        const lastStep = StepsInvolved[StepsInvolved.length - 1];
        const CORRECT_FEEDBACK = stepDetails.CORRECT_FEEDBACK;
        const INCORRECT_1_FEEDBACK = stepDetails.INCORRECT_1_FEEDBACK;
        const INCORRECT_2_FEEDBACK = stepDetails.INCORRECT_2_FEEDBACK;
        const dropdownNumber =actualStepNumber - 1;
        const supportingRationalHeadingLocator=`section#step-dropdown-${dropdownNumber}>div>div.supporting-rationale-container>.supporting-rationale-heading`
        const baseLocator=`//*[@id='attempt-dropdown-arrow-button-${attemptNumber}']/parent::*/parent::div[contains(@class, 'attempt-heading-container')]/following-sibling::section//section`;
        const supportingRationalTextTextLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'score-title-value-container')]//div[@class='score-msg']`;
        const supportingRationalTitleLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//strong[contains(@class,'score-msg-title')]`;
        const stepScoretLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'response-score-value')]`;
        
        //*[@id='step-dropdown-0']//div/div[contains(@class,'score-area')]/*[contains(@class,'score-msg')]//div//div[contains(@class,'response-score-value')]
        //await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalHeadingLocator).first()).toHaveText("Supporting Rationale");
        //await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextLocator).first()).toHaveText(feedback);
        
            if (lastStep=="CORRECT") {
            feedbackTextTitle=CORRECT_FEEDBACK.title;
            feedbackText =CORRECT_FEEDBACK.text;

            } else if (lastStep.includes("INCORRECT_1")) {
            feedbackTextTitle=INCORRECT_1_FEEDBACK.title;
             feedbackText=INCORRECT_1_FEEDBACK.text;
            } else if (lastStep.includes("INCORRECT_2")) {
             feedbackTextTitle=INCORRECT_2_FEEDBACK.title;
            feedbackText=INCORRECT_2_FEEDBACK.text;
            } 
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTitleLocator).first()).toHaveText(feedbackTextTitle);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextTextLocator)).toHaveText(feedbackText);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(stepScoretLocator)).toHaveText(": "+ score.toString());
        
    }
    private async verifySupportingRationalsForMultiselect(step: string,StepsInvolved:string[],actualStepNumber:number,sceneLevel:string, testData: any,attemptNumber:number,score:number) {
       let feedbackText='';
       let feedbackTextTitle=''
        const stepDetails = testData[`STEP_${sceneLevel}`];
        const lastStep = StepsInvolved[StepsInvolved.length - 1];
        const CORRECT_FEEDBACK = stepDetails.CORRECT_FEEDBACK;
        const INCORRECT_FEEDBACK = stepDetails.INCORRECT_FEEDBACK;
        //const INCORRECT_2_FEEDBACK = stepDetails.INCORRECT_2_FEEDBACK;
        const dropdownNumber =actualStepNumber - 1;
        const supportingRationalHeadingLocator=`section#step-dropdown-${dropdownNumber}>div>div.supporting-rationale-container>.supporting-rationale-heading`
        //const supportingRationalTextLocator=`section#step-dropdown-${dropdownNumber}>div>div.score-area >div>div>div>div.score-msg`
        const baseLocator=`//*[@id='attempt-dropdown-arrow-button-${attemptNumber}']/parent::*/parent::div[contains(@class, 'attempt-heading-container')]/following-sibling::section//section`;
        const supportingRationalTextTextLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'score-title-value-container')]//div[@class='score-msg']`;
        const supportingRationalTitleLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//strong[contains(@class,'score-msg-title')]`;
        const stepScoretLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'response-score-value')]`;
        
        //*[@id='step-dropdown-0']//div/div[contains(@class,'score-area')]/*[contains(@class,'score-msg')]//div//div[contains(@class,'response-score-value')]
        //await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalHeadingLocator).first()).toHaveText("Supporting Rationale");
        //await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextLocator).first()).toHaveText(feedback);
        
            if (lastStep=="CORRECT") {
            feedbackTextTitle=CORRECT_FEEDBACK.title;
            feedbackText =CORRECT_FEEDBACK.text;

            } else {
            feedbackTextTitle=INCORRECT_FEEDBACK.title;
             feedbackText=INCORRECT_FEEDBACK.text;
            } 
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTitleLocator)).toHaveText(feedbackTextTitle);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextTextLocator)).toHaveText(feedbackText);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(stepScoretLocator)).toHaveText(": "+ score.toString());
        
    }



    private async verifyUserActionDetails(
    step: string,
    StepsInvolved: string[],
    actualStepNumber: number,
    sceneLevel: string,
    testData: any,
    attemptNumber: number
) {
    const stepDetails = testData[`STEP_${sceneLevel}`];
    const correctOptionText = stepDetails.CORRECT;
    const incorrectOptionText = stepDetails.INCORRECT_1;
    const incorrectOptionText2 = stepDetails.INCORRECT_2;

    // Calculate dropdown number
    const dropdownNumber = actualStepNumber - 1;

    // Base locator for the dropdown
    const baseLocator = `//*[@id='attempt-dropdown-arrow-button-${attemptNumber}']/parent::*/parent::div[contains(@class, 'attempt-heading-container')]/following-sibling::section//section`;

    // Locator for autocorrect action
    const autoCorrectLocator = `${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'autocorrect-action-container')]//span[@class='action-description']`;

    // Helper function to create locators (returns locator strings)
    const createLocators = () => {
        const userActionLocator = `${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'user-action-details-container')]//div[@class='action-text']`;
        const userActionTextLocator = `${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'user-action-details-container')]//div[@class='action-description']`;
        return { userActionLocator, userActionTextLocator };
    };

    // Helper function to verify expected action
    const verifyAction = async (actionPosition: number, expectedText: string, expectedDescription: string) => {
        const { userActionLocator, userActionTextLocator } = createLocators();
        await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText(expectedText);
        await expect(this.frameLocator.locator(userActionTextLocator).nth(actionPosition)).toHaveText(expectedDescription);
    };

    // Helper to resolve action details from step key
    const getStepDetails = (step: string) => {
        if (step === 'CORRECT') {
            return {
                optionText: correctOptionText,
                actionText: "Selected Correct Choice"
            };
        } else if (step.includes('INCORRECT_1')) {
            return {
                optionText: incorrectOptionText,
                actionText: "Selected Incorrect Choice"
            };
        } else if (step.includes('INCORRECT_2')) {
            return {
                optionText: incorrectOptionText2,
                actionText: "Selected Incorrect Choice"
            };
        } else {
            throw new Error(`Unknown step format: ${step}`);
        }
    };

    // Loop through all actions and verify them
    for (let i = 0; i < StepsInvolved.length; i++) {
        const { optionText, actionText } = getStepDetails(StepsInvolved[i]);
        await verifyAction(i, actionText, optionText);
    }

    // If the last step was incorrect, verify the auto-correct suggestion
    const lastStep = StepsInvolved[StepsInvolved.length - 1];
    if (lastStep.includes("INCORRECT")) {
        await expect(this.frameLocator.locator(autoCorrectLocator)).toHaveText(correctOptionText);
    }
}

     private async verifyUserActionDetailsMultiSelect(step: string,StepsInvolved:string[],actualStepNumber:number,sceneLevel:string, testData: any,attemptNumber:number) {
        const stepDetails = testData[`STEP_${sceneLevel}`];
        const idealChoices = stepDetails.correctAnswers;
        const nonIdealChoices = stepDetails.incorrectAnswers;
        // Calculate the dropdown number based on actualStepNumber
        const dropdownNumber =actualStepNumber - 1;
        const baseLocator=`//*[@id='attempt-dropdown-arrow-button-${attemptNumber}']/parent::*/parent::div[contains(@class, 'attempt-heading-container')]/following-sibling::section//section`;
        const autoCorrectLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'autocorrect-action-container')]//span[@class='action-description']`;
            
        // Helper function to create locators
        const createLocators = () => {
        const userActionLocator = `${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'user-action-details-container')]//div[@class='action-text']`;
        const userActionTextLocator = `${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div//div[contains(@class,'user-action-details-container')]//div[@class='action-description']`;
        return { userActionLocator, userActionTextLocator };
    };
        
        // Helper function to verify action expectations
        const verifyAction = async (actionPosition: number, expectedText: string, expectedDescription: string) => {
            const { userActionLocator, userActionTextLocator } = createLocators();
            await expect(this.frameLocator.locator(userActionLocator).nth(actionPosition)).toHaveText(expectedText);
            await expect(this.frameLocator.locator(userActionTextLocator).nth(actionPosition)).toHaveText(expectedDescription);
        };
       
        for (let i = 0; i < StepsInvolved.length; i++) {
            let optionToClick: any;
            if (StepsInvolved.length === 1) {
                if (StepsInvolved[i] === "CORRECT") {
                for (let j = 0; j < idealChoices.length; j++) {
                    optionToClick = idealChoices[j];
                    await verifyAction( j, "Selected Correct Choice", optionToClick);
                }
                } 
            } else if (StepsInvolved.length === 2) {
                const firstEntry = StepsInvolved[0];
                const secondEntry = StepsInvolved[1];
                if (secondEntry === "CORRECT") {
                for (let j = 0; j < idealChoices.length; j++) {
                    optionToClick = idealChoices[j];
                    console.log("clicked correct:" + idealChoices[j]);
                    await verifyAction( j, "Selected Correct Choice", optionToClick);
                }
                for (let j = 0; j < nonIdealChoices.length; j++) {
                    optionToClick = nonIdealChoices[j];
                    console.log("clicked incorrect:" + nonIdealChoices[j]);
                    await verifyAction( j+idealChoices.length, "Selected Incorrect Choice", optionToClick);
                }
                console.log("Second attempt: Selecting only incorrect options");
                for (let j = 0; j < idealChoices.length; j++) {
                    optionToClick = idealChoices[j];
                    //console.log("clicked correct:" + idealChoices[j]);
                    await verifyAction( j+idealChoices.length+nonIdealChoices.length, "Selected Correct Choice", optionToClick);
                }
                // for (let j = 0; j < nonIdealChoices.length; j++) {
                //     optionToClick = nonIdealChoices[j];
                //    console.log("clicked incorrect:" + nonIdealChoices[j]);
                //    //await verifyAction( j, "Selected Correct Choice", optionToClick);
                //    await verifyAction( j+idealChoices.length+nonIdealChoices.length, "Selected Incorrect Choice", optionToClick);
                // }
                
                } else if (firstEntry.includes("INCORRECT") && secondEntry.includes("INCORRECT")) {
                console.log("Both entries are incorrect - sequential selection approach");
                const firstIncorrectOption = nonIdealChoices[0];
                console.log("clicked first incorrect:" + firstIncorrectOption);
                await verifyAction( 0, "Selected Incorrect Choice", firstIncorrectOption);
                console.log("Second attempt: Selecting first correct option");
                const firstCorrectOption = idealChoices[0];
                console.log("clicked first correct:" + firstCorrectOption);
                await verifyAction( 1, "Selected Incorrect Choice", firstIncorrectOption);
                await verifyAction( 2, "Selected Correct Choice", firstCorrectOption);
                for (let j = 1; j < idealChoices.length; j++) {
                    //await expect(this.frameLocator.locator(autoCorrectLocator).nth(j-1)).toHaveText(idealChoices[j]);
                }  

                } else {
                throw new Error(`Unknown step format combination: ${firstEntry}, ${secondEntry}`);
                }
            } 
        }   
    }
}