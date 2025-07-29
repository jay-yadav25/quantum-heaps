import { expect, Locator, type Page } from '@playwright/test';

export class SummaryReportActivityTwo {
    readonly page: Page;
    readonly finalScore: Locator;

    constructor(page: Page) {
        this.page = page;
        this.finalScore = page.frameLocator('iframe[name="ext_012345678_1"]').locator("//strong[@class='score-value']").first();
    }

    public async verifyFinalScore(path: string[], testData: any) {
        const attempts: string[][] = [];
        let currentAttempt: string[] = [];
        
        for (let i = 0; i < path.length; i++) {
            const step = path[i];

            if (step.startsWith('RESTART') || step.startsWith('SUBMIT') || step === 'COMPLETE') {
                // Add current attempt only if it has valid steps (not empty)
                if (currentAttempt.length > 0) {
                    attempts.push([...currentAttempt]);
                }
                currentAttempt = [];
                // Break if we hit SUBMIT or FAILED
                if (step.startsWith('SUBMIT') || step === 'FAILED') {
                    break;
                }
            } else {
                // Skip HINT and steps that start with PA
                if (step !== 'HINT' && !step.startsWith('PA')) {
                    currentAttempt.push(step);
                }
            }
        }
        
        // Add the last attempt if it exists and has valid steps
        if (currentAttempt.length > 0) {
            attempts.push(currentAttempt);
        }

        console.log(`\nTotal attempts found: ${attempts.length}`);
        console.log('Attempts:', attempts);
        
        for (let i = 0; i < attempts.length; i++) {
            const attempt = attempts[i];
            const attemptNumber: number = i + 1;
            console.log(`\nProcessing Attempt ${attemptNumber}:`, attempt);

            await this.veryfySelectedOptionAndReportResponse(attempt, attemptNumber, testData, attempts);
        }
    }

    private async veryfySelectedOptionAndReportResponse(
        attempt: string[], attemptNumber: number,
        testData: any, allAttempts: string[][]) {

        if (attemptNumber > 1) {
            const attemptDropdownButton = `#attempt-dropdown-arrow-button-${attemptNumber - 1}`
            await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attemptDropdownButton).first().click();
        }


        await this.verifyPreviouslyCompletedAndNotReachLevel(attempt, attemptNumber);
        let responseNumber = 0;
        let currentMainLevel = "";
        //attempt is string so i am running it from first to last
        for (let i = 0; i < attempt.length; i++) {
            const step = attempt[i];
            const [level, rawAction] = step.split("_");

            // Extract challenge level number (e.g., C1 -> 1, C2 -> 2, C3 -> 3)
            const challengeLevel = level.startsWith('C') ? parseInt(level.substring(1)) : 0;
            const mainLevel = level.split('.')[0];

            // If we've moved to a new main level, reset responseNumber
            if (mainLevel !== currentMainLevel) {
                responseNumber = 1;
                currentMainLevel = mainLevel;
            } else {
                // Same main level but a new sublevel or action
                responseNumber++;
            }

            console.log(`\nStep: ${step}, Response Number: ${responseNumber}`);

            let selectedOption = null;


            if (rawAction === "CORRECT") {

                selectedOption = testData[level]?.["ideal"];
            } else if (rawAction === "INCORRECT") {
                selectedOption = testData[level]?.["incorrect"];
            } else if (rawAction === "DISTRACTOR") {
                selectedOption = testData[level]?.["distractor"];
            }
            //verifying selectedoption for each step with their score .
            //here ican add those logic for first and last text
            //add logic for attempt 1 PA reply response
            const userResponse = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
                `/div[${challengeLevel + 1}]` +
                `/div[2]/div[${responseNumber}]//div[contains(@class, 'user-response-text')]`;

            await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(userResponse)).toHaveText(selectedOption);


            // Get patient response and mood based on current step and previous actions
            const patientResponseData = this.getPatientResponseAndMood(
                attemptNumber,
                i,
                attempt,
                allAttempts || [],
                testData,
                step
            );


            await this.verifyPatientResponseAndMood(
                attemptNumber,
                challengeLevel,
                responseNumber,
                patientResponseData.patientResponse,
                patientResponseData.patientMood
            );


            // Report response should still be based on the current step
            let reportResponse = null;

            // Map the current raw action to the corresponding option
            if (rawAction === "CORRECT") {
                reportResponse = testData[level]?.["ideal_feedbackAlertText"];
            } else if (rawAction === "INCORRECT") {
                reportResponse = testData[level]?.["incorrect_feedbackAlertText"];
            } else if (rawAction === "DISTRACTOR") {
                reportResponse = testData[level]?.["distractor_feedbackAlertText"];
            }

            const reportResponseLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
                `/div[${challengeLevel+1}]` +
                `/div[2]/div[${responseNumber}]//div[contains(@class, 'score-msg')]//div[2]`;
            await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(reportResponseLocator)).toHaveText(reportResponse);

        }
    }

    private async verifyPatientResponseAndMood(
        attemptNumber: number,
        challengeLevel: number,
        responseNumber: number,
        expectedResponse: string,
        expectedMood: string
    ) {
        const baseLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
            `/div[${challengeLevel+1}]` +
            `/div[2]/div[${responseNumber}]`;

        const responseLocator = `${baseLocator}//div[contains(@class, 'patient-response-text')]`;
        const moodLocator = `${baseLocator}//div[contains(@class, 'patient-reaction')]`;

        // Verify patient response text
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(responseLocator))
            .toHaveText(expectedResponse);

        // Verify patient mood text
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(moodLocator))
            .toHaveText("[" + expectedMood + "]");
    }

    private getPatientResponseAndMood(
        attemptNumber: number,
        stepIndex: number,
        currentAttempt: string[],
        allAttempts: string[][] = [],
        testData: any,
        step: string
    ) {
        console.log(`Getting patient response for attempt ${attemptNumber}, step ${stepIndex}`);

        // First step of any attempt
        if (stepIndex === 0) {
            return this.getFirstStepResponse(step, attemptNumber, allAttempts, testData);
        }

        // Subsequent steps use previous step's response
        const prevStep = currentAttempt[stepIndex - 1];
        const [prevLevel, prevRawAction] = prevStep.split("_");
        console.log(`Using previous step response from ${prevStep}`);

        return this.getResponseDataForAction(prevRawAction, prevLevel, testData);
    }

    private getFirstStepResponse(
        step: string,
        attemptNumber: number,
        allAttempts: string[][],
        testData: any
    ) {
        // First attempt always uses default response
        if (step.startsWith("C1")) {
            return {
                patientResponse: testData["default_chat"]["Ricardo_Gonzalez"],
                patientMood: testData["default_chat"]["Ricardo_Gonzalez_reply_mood"]
            };
        }
        const lastCorrectResponse = this.findLastCorrectResponse(attemptNumber, allAttempts, testData);
        return lastCorrectResponse;
    }

    private findLastCorrectResponse(
        attemptNumber: number,
        allAttempts: string[][],
        testData: any
    ) {
        // Search from most recent to oldest attempt
        for (let attemptIdx = attemptNumber - 2; attemptIdx >= 0; attemptIdx--) {
            const attempt = allAttempts[attemptIdx];
            if (!attempt?.length) continue;

            // Search from last to first step in attempt
            for (let stepIdx = attempt.length - 1; stepIdx >= 0; stepIdx--) {
                const step = attempt[stepIdx];
                const [level, rawAction] = step.split("_");

                if (rawAction === "CORRECT") {
                    console.log(`Found CORRECT action ${step} in attempt ${attemptIdx + 1}`);
                    return this.getResponseDataForAction(rawAction, level, testData);
                }
            }
        }
        // Return default if no CORRECT action found
        return {
            patientResponse: testData["default_chat"]["Ricardo_Gonzalez"],
            patientMood: testData["default_chat"]["Ricardo_Gonzalez_reply_mood"]
        };
    }

    // private getResponseDataForAction(actionType: string, level: string, testData: any) {
    //     let patientResponse = null;
    //     let patientMood = null;

    //     switch (actionType) {
    //         case "CORRECT":
    //             patientResponse = testData[level]?.["ideal_reply"];
    //             patientMood = testData[level]?.["ideal_reply_mood"];
    //             break;
    //         case "INCORRECT":
    //             patientResponse = testData[level]?.["incorrect_reply"];
    //             patientMood = testData[level]?.["incorrect_reply_mood"];
    //             break;
    //         case "DISTRACTOR":
    //             patientResponse = testData[level]?.["distractor_reply"];
    //             patientMood = testData[level]?.["distractor_reply_mood"];
    //             break;
    //         default:
    //             patientResponse = testData["default_chat"]["Ricardo_Gonzalez"];
    //             patientMood = testData["default_chat"]["Ricardo_Gonzalez_reply_mood"];
    //     }
    //     return { patientResponse, patientMood };
    // }

    private getResponseDataForAction(actionType: string, level: string, testData: any) {
    let patientResponse = null;
    let patientMood = null;

    // Check for special level conditions first
    const isC2Level = level === "C1" || level === "C1.1" || level === "C1.2";
    const isC3Level = level === "C2" || level === "C2.1";
    console.log(level);
    switch (actionType) {
        case "CORRECT":
            if (isC2Level) {
                patientResponse = testData[level]?.["ideal_reply2"];
                patientMood = testData[level]?.["ideal_reply_mood2"];
            } else if (isC3Level) {
                patientResponse = testData[level]?.["ideal_reply3"];
                patientMood = testData[level]?.["ideal_reply_mood3"];
            } else {
                patientResponse = testData[level]?.["ideal_reply"];
                patientMood = testData[level]?.["ideal_reply_mood"];
            }
            break;
        case "INCORRECT":
            if (isC2Level) {
                patientResponse = testData[level]?.["incorrect_reply2"];
                patientMood = testData[level]?.["incorrect_reply_mood2"];
            } else if (isC3Level) {
                patientResponse = testData[level]?.["incorrect_reply3"];
                patientMood = testData[level]?.["incorrect_reply_mood3"];
            } else {
                patientResponse = testData[level]?.["incorrect_reply"];
                patientMood = testData[level]?.["incorrect_reply_mood"];
            }
            break;
        case "DISTRACTOR":
            if (isC2Level) {
                patientResponse = testData[level]?.["distractor_reply2"];
                patientMood = testData[level]?.["distractor_reply_mood2"];
            } else if (isC3Level) {
                patientResponse = testData[level]?.["distractor_reply3"];
                patientMood = testData[level]?.["distractor_reply_mood3"];
            } else {
                patientResponse = testData[level]?.["distractor_reply"];
                patientMood = testData[level]?.["distractor_reply_mood"];
            }
            break;
        default:
            patientResponse = testData["default_chat"]["Ricardo_Gonzalez"];
            patientMood = testData["default_chat"]["Ricardo_Gonzalez_reply_mood"];
    }
    
    return { patientResponse, patientMood };
}


    public async verifyPreviouslyCompletedAndNotReachLevel(attempt: string[], attemptNumber: number) {
        const firstStep = attempt[0];
        const [level, rawAction] = firstStep.split("_");
        const firstchallengeLevel = level.startsWith('C') ? parseInt(level.substring(1)) : 0;

        const lastStep = attempt[attempt.length - 1];
        console.log(lastStep);
        const [level1, rawAction1] = lastStep.split("_");
        const lastchallengeLevel = level1.startsWith('C') ? parseInt(level1.substring(1)) : 0;
        // Check if first challenge level is greater than 1
        console.log("first" + firstchallengeLevel);
        console.log("las" + lastchallengeLevel);


        if (firstchallengeLevel > 1) {
            // Loop from 1 to firstchallengeLevel-1
            for (let i = 1; i < firstchallengeLevel; i++) {
                const textLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
                    `/div[${i + 1}]//div[contains(@class ,'empty-response-box')]/div/p`
                await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(textLocator)).toHaveText("You have cleared this challenge level in your previous attempt.");
            }
        }
        if (lastchallengeLevel < 5) {
            // Loop from lastchallengeLevel+1 to 3
            for (let i = lastchallengeLevel + 1; i <= 5; i++) {
                const textLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
                    `/div[${i + 1}]//div[contains(@class ,'empty-response-box')]/div/p`
                console.log(`Verifying text for iteration ${i + 1} (last range)`);
                await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(textLocator)).toHaveText("You did not clear the previous challenge level to progress to this one.");
            }
        }
    }

}