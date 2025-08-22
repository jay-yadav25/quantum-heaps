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

    /**
     * Runs the scenario path for Activity Four in challenge mode
     * @param path Array of steps to execute
     * @param testData Test data containing scene information
     */
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
        
        // Store the final attempt if there are scores
        if (this.currentAttemptScores.length > 0) {
            this.scoresArray.push([...this.currentAttemptScores]);
        }
        
        // Calculate averages and find highest
        this.calculateAveragesAndHighest();
        
        console.log('Final scores array:', this.scoresArray);
        console.log('Attempt averages:', this.attemptAverages);
         const avgScores = this.attemptAverages;
         const overallSocre = this.highestAttemptAverage;
          //const  overallSocre1 =overallSocre[0];
         const firstEntry = avgScores[0];
        const secondEntry = avgScores[1];
        await expect((this.attemptScore).nth(0)).toHaveText(": "+firstEntry.toString()+"%");
        await expect((this.attemptScore).nth(1)).toHaveText(": "+secondEntry.toString()+"%");
        await expect((this.overallScore)).toHaveText(overallSocre.toString()+"%");

        console.log('Highest attempt average:', this.highestAttemptAverage);
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
  // Find index of the first underscore after the step prefix (handles C3.1, M4.2, etc.)
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
    
    // Calculate score based on the pattern
    if (StepsInvolved.length==1 && StepsInvolved[0]=="CORRECT"){
        score=1;
    }else if (StepsInvolved.length==1 && StepsInvolved[0]!="CORRECT"){
        score=0; // Changed from "Invalid Steps" to score=0
    }else if (StepsInvolved.length==2 && StepsInvolved[1]=="CORRECT"){
        score=0.5;
    }else if (StepsInvolved.length>=2){
        score=0; // Multiple incorrect attempts
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
      // await this.verifySupportingRationals(step,StepsInvolved,actualStepNumber,sceneLevel, testData);
       if (step.startsWith('M')){
            // await this.verifyUserActionDetailsMultiSelect(StepsInvolved,actualStepNumber,sceneLevel, testData);
             await this.verifySupportingRationalsForMultiselect(step,StepsInvolved,actualStepNumber,sceneLevel, testData,attemptNumber,score);
      
       }else{
            // await this.verifyUserActionDetails(StepsInvolved,actualStepNumber,sceneLevel, testData);
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
        //await this.page.pause();
        const baseLocator=`//*[@id='attempt-dropdown-arrow-button-${attemptNumber}']/parent::*/parent::div[contains(@class, 'attempt-heading-container')]/following-sibling::section//section`;
        const instructionHeadingLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'description-container')]/*[contains(@class,'description-heading')]`;
        const instructionLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'description-container')]/*[contains(@class,'description-text')]`;
         const questionTextLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'description-container')]/*[contains(@class,'description-question')]`;
        
         await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionHeadingLocator)).toHaveText("Description");
        const noOfInstructionItems = await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(instructionLocator).all();
        for (let i = 0; i < instructionText.length; i++) {
            await expect(noOfInstructionItems[i]).toHaveText(instructionText[i]);
        } 
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(questionTextLocator)).toHaveText(questionText);
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
        //const supportingRationalTextLocator=`section#step-dropdown-${dropdownNumber}>div>div.score-area >div>div>div>div.score-msg`
        const baseLocator=`//*[@id='attempt-dropdown-arrow-button-${attemptNumber}']/parent::*/parent::div[contains(@class, 'attempt-heading-container')]/following-sibling::section//section`;
        const supportingRationalTextTextLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'score-area')]/*[contains(@class,'score-msg')]//div//div//div[contains(@class,'score-msg')]`;
        const stepScoretLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'score-area')]/*[contains(@class,'score-msg')]//div//div[contains(@class,'response-score-value')]`;
        
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
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextTextLocator).first()).toHaveText(feedbackTextTitle);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextTextLocator).nth(1)).toHaveText(feedbackText);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(stepScoretLocator)).toHaveText(": "+ score.toString());
        
    }
    private async verifySupportingRationalsForMultiselect(step: string,StepsInvolved:string[],actualStepNumber:number,sceneLevel:string, testData: any,attemptNumber:number,score:number) {
       let feedbackText='';
       let feedbackTextTitle=''
        const stepDetails = testData[`STEP_${sceneLevel}`];
        const lastStep = StepsInvolved[StepsInvolved.length - 1];
        const CORRECT_FEEDBACK = stepDetails.CORRECT_FEEDBACK;
        const INCORRECT_FEEDBACK = stepDetails.INCORRECT_1_FEEDBACK;
        //const INCORRECT_2_FEEDBACK = stepDetails.INCORRECT_2_FEEDBACK;
        const dropdownNumber =actualStepNumber - 1;
        const supportingRationalHeadingLocator=`section#step-dropdown-${dropdownNumber}>div>div.supporting-rationale-container>.supporting-rationale-heading`
        //const supportingRationalTextLocator=`section#step-dropdown-${dropdownNumber}>div>div.score-area >div>div>div>div.score-msg`
        const baseLocator=`//*[@id='attempt-dropdown-arrow-button-${attemptNumber}']/parent::*/parent::div[contains(@class, 'attempt-heading-container')]/following-sibling::section//section`;
        const supportingRationalTextTextLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'score-area')]/*[contains(@class,'score-msg')]//div//div//div[contains(@class,'score-msg')]`;
        const stepScoretLocator=`${baseLocator}[@id='step-dropdown-${dropdownNumber}']//div/div[contains(@class,'score-area')]/*[contains(@class,'score-msg')]//div//div[contains(@class,'response-score-value')]`;
        
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
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextTextLocator).first()).toHaveText(feedbackTextTitle);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(supportingRationalTextTextLocator).nth(1)).toHaveText(feedbackText);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(stepScoretLocator)).toHaveText(": "+ score.toString());
        
    }



    private async verifyUserActionDetails(StepsInvolved:string[],actualStepNumber:number,sceneLevel:string, testData: any) {
        const stepDetails = testData[`STEP_${sceneLevel}`];
        const correctOptionText = stepDetails.CORRECT;
        const incorrectOptionText = stepDetails.INCORRECT_1;
        const incorrectOptionText2 = stepDetails.INCORRECT_2;
        
        // Calculate the dropdown number based on actualStepNumber
        const dropdownNumber =actualStepNumber - 1;
        
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
        if (step=='CORRECT') {
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
    
        for(let i=0;i<StepsInvolved.length; i++ ){
             const { optionText, actionText } = getStepDetails(StepsInvolved[i]);
            await verifyAction(i, actionText, optionText);
        }
        }
     private async verifyUserActionDetailsMultiSelect(StepsInvolved:string[],actualStepNumber:number,sceneLevel:string, testData: any) {
        const stepDetails = testData[`STEP_${sceneLevel}`];
        const idealChoices = stepDetails.correctAnswers;
        const nonIdealChoices = stepDetails.incorrectAnswers;
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
       
        const dropdownNumber =actualStepNumber - 1;
        for (let i = 0; i < StepsInvolved.length; i++) {
            let optionToClick: any;
            if (StepsInvolved.length === 1) {
                if (StepsInvolved[i] === "CORRECT") {
                for (let j = 0; j < idealChoices.length; j++) {
                    optionToClick = idealChoices[j];
                    console.log("clicked:" + optionToClick);
                    await verifyAction( j, "Selected Correct Choice", optionToClick);
                }
                } 
            } else if (StepsInvolved.length === 2) {
                const firstEntry = StepsInvolved[0];
                const secondEntry = StepsInvolved[1];
                if (secondEntry === "CORRECT") {
                for (let j = 0; j < idealChoices.length; j++) {
                    console.log("clicked correct:" + idealChoices[j]);
                    await verifyAction( j, "Selected Correct Choice", optionToClick);
                }
                for (let j = 0; j < nonIdealChoices.length; j++) {
                    console.log("clicked incorrect:" + nonIdealChoices[j]);
                    await verifyAction( j+idealChoices.length, "Selected Incorrect Choice", optionToClick);
                }
                console.log("Second attempt: Selecting only incorrect options");
                for (let j = 0; j < nonIdealChoices.length; j++) {
                   console.log("clicked incorrect:" + nonIdealChoices[j]);
                   await verifyAction( j, "Selected Correct Choice", optionToClick);
                   await verifyAction( j+idealChoices.length+nonIdealChoices.length, "Selected Incorrect Choice", optionToClick);
                }
                
                } else if (firstEntry.includes("INCORRECT") && secondEntry.includes("INCORRECT")) {
                console.log("Both entries are incorrect - sequential selection approach");
                const firstIncorrectOption = nonIdealChoices[0];
                console.log("clicked first incorrect:" + firstIncorrectOption);
                await verifyAction( 0, "Selected Incorrect Choice", optionToClick);
                console.log("Second attempt: Selecting first correct option");
                const firstCorrectOption = idealChoices[0];
                console.log("clicked first correct:" + firstCorrectOption);
                await verifyAction( 1, "Selected Incorrect Choice", optionToClick);
                } else {
                throw new Error(`Unknown step format combination: ${firstEntry}, ${secondEntry}`);
                }
            } 
        }   
    }
}