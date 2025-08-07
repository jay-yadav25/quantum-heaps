import { expect, Locator, type Page } from '@playwright/test';

export class SummaryReportActivityFive {
    readonly page: Page;
    readonly finalScore: Locator;
    
    private readonly MAX_CHALLENGE_LEVELS = 5;
    private readonly MAX_TOTAL_ATTEMPTS = 3;

    constructor(page: Page) {
        this.page = page;
        this.finalScore = page.frameLocator('iframe[name="ext_012345678_1"]').locator("//strong[@class='score-value']").first();
    }

    public async verifyFinalScore(path: string[], testData: any) {
        const attempts: string[][] = [];
        let currentAttempt: string[] = [];
        
        for (let i = 0; i < path.length; i++) {
            const step = path[i];

            if (step.startsWith('SUBMIT') || step.startsWith('RESTART') || step.startsWith('REATTEMPT') || step === 'FAILED' || step === 'COMPLETE') {
                if (currentAttempt.length > 0) {
                    attempts.push([...currentAttempt]);
                    currentAttempt = [];
                }
                if (step === 'FAILED' || step.startsWith('SUBMIT')) {
                    break;
                }
            } else {
                currentAttempt.push(step);
            }
        }
        if (currentAttempt.length > 0) {
            attempts.push(currentAttempt);
        }

        console.log(`\nTotal attempts found: ${attempts.length}`);
        const attemptScores: number[] = [];
        const allAttemptsData = [];
        const highestLevelReached: Record<number, number> = {}; 
        for (let i = 0; i < attempts.length; i++) {
            const attempt = attempts[i];
            let highestLevel = 0;

            for (const step of attempt) {
                const levelMatch = step.match(/C(\d+)/);
                if (!levelMatch) continue;

                const levelNum = parseInt(levelMatch[1], 10);
                if (levelNum > highestLevel) {
                    highestLevel = levelNum;
                }
            }

            highestLevelReached[i + 1] = highestLevel;
        }

        let cumulativeAttemptData: Record<string, { correct: number, totalChallenges: number }> = {};

        for (let i = 0; i < attempts.length; i++) {
            const attempt = attempts[i];
            const currentAttemptNum = i + 1;
            const currentAttemptLevelData: Record<string, { correct: number, totalChallenges: number }> = {};

            for (const step of attempt) {
                const levelMatch = step.match(/C(\d+)/);
                if (!levelMatch) continue;

                const level = levelMatch[1];
                const isCorrect = step.includes('_CORRECT');

                if (!currentAttemptLevelData[level]) {
                    currentAttemptLevelData[level] = { correct: 0, totalChallenges: 0 };
                }

                currentAttemptLevelData[level].totalChallenges++;
                if (isCorrect) {
                    currentAttemptLevelData[level].correct++;
                }
            }

            const attemptWithCarryForward: Record<string, { correct: number, totalChallenges: number }> = {};

            // First copy all previous attempt data as our starting point
            for (const [level, data] of Object.entries(cumulativeAttemptData)) {
                attemptWithCarryForward[level] = { ...data };
            }

            // Then update with current attempt data for levels that were played
            for (const [level, data] of Object.entries(currentAttemptLevelData)) {
                if (!attemptWithCarryForward[level]) {
                    attemptWithCarryForward[level] = { correct: 0, totalChallenges: 0 };
                }
                attemptWithCarryForward[level] = {
                    correct: data.correct,
                    totalChallenges: data.totalChallenges
                };
            }

            // Save this attempt's cumulative data for the next iteration
            cumulativeAttemptData = { ...attemptWithCarryForward };

            // Calculate scores for this attempt's levels
            const levelScores: { level: string, score: number }[] = [];
            const highestLevel = highestLevelReached[currentAttemptNum];

            // Calculate scores for all levels up to the highest one reached
            for (let levelNum = 1; levelNum <= highestLevel; levelNum++) {
                const levelKey = levelNum.toString();
                const levelData = attemptWithCarryForward[levelKey];

                if (levelData) {
                    const { correct = 0, totalChallenges = 0 } = levelData;
                    const score = totalChallenges > 0 ? (correct / totalChallenges) * 100 : 0;
                    levelScores.push({ level: levelKey, score });
                } else {
                    levelScores.push({ level: levelKey, score: 0 });
                }
            }

            // Extract raw scores and pad to MAX_CHALLENGE_LEVELS
            const rawScores = levelScores.map(item => item.score);
            
            // Pad rawScores to MAX_CHALLENGE_LEVELS with 0s if needed
            while (rawScores.length < this.MAX_CHALLENGE_LEVELS) {
                rawScores.push(0);
            }

            // Calculate average score - always divide by MAX_CHALLENGE_LEVELS or actual levels if more than MAX_CHALLENGE_LEVELS
            const totalLevels = this.MAX_CHALLENGE_LEVELS;
            const sumOfScores = levelScores.reduce((sum, item) => sum + item.score, 0);
            const attemptScore = sumOfScores / totalLevels;

            const scoresForDisplay = rawScores.slice(0, this.MAX_CHALLENGE_LEVELS).map(s => this.formatScore(s));
            const attemptScores1 = `[${scoresForDisplay.join(', ')}]`;
            const attemptAverageScore = `: ${this.formatScore(attemptScore)}`;

            allAttemptsData.push({
                attempt,
                attemptScores: attemptScores1,
                attemptAverageScore,
                attemptNumber: currentAttemptNum,
                levelScores,
                rawScores 
            });

            attemptScores.push(attemptScore);
        }

        for (const attemptData of allAttemptsData) {
            console.log(
                "Steps in this attempt" +attemptData.attempt, //steps in this attempt 
               "All Five challenge level scores"+ attemptData.rawScores,// all three challenge level scores (padded to MAX_CHALLENGE_LEVELS)
               "Attempt average score"+ attemptData.attemptAverageScore,// attempt average score
               "Attempt No"+ attemptData.attemptNumber,//this is which attempt like1,2,3 
               // attempts  //all attempt data will be here[[],[],]
            );
        }

        // Verify and report each attempt
        for (const attemptData of allAttemptsData) {
            await this.veryfySelectedOptionAndReportResponse(
                attemptData.attempt,
                attemptData.rawScores,
                attemptData.attemptAverageScore,
                testData,
                attemptData.attemptNumber,
                attempts
            );
        }

        const finalScore = Math.max(...attemptScores, 0);
        console.log(`\n----- FINAL RESULT -----`);
        console.log(`All attempt scores: [${attemptScores.map(s => this.formatScore(s)).join(', ')}]`);
        console.log(`Final Score (highest attempt): ${this.formatScore(finalScore)}`);
        const formattedFinalScore = this.formatScore(finalScore);
        await expect(this.finalScore).toHaveText(`${formattedFinalScore}`);
        return {
            finalScore,
            attemptScores,
            allAttemptsData
        };
    }

    private async veryfySelectedOptionAndReportResponse(
        attempt: string[],
        attemptScores: number[],
        attemptAverageScore: string,
        testData: any,
        attemptNumber: number,
        allAttempts?: string[][]
    ) {
        console.log(`Processing Attempt ${attemptNumber}:`);
        console.log(`Steps in this attempt: ${attempt.join(', ')}`);
        console.log(`Attempt ${attemptNumber} scores: [${attemptScores}]`);
        console.log(`Attempt ${attemptNumber} Expected average Score: ${attemptAverageScore}`);
        if (attemptNumber > 1) {
            const attemptDropdownButton = `#attempt-dropdown-arrow-button-${attemptNumber-1}`
            await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attemptDropdownButton).first().click();
        }
        //Which is heading and work for reattempt as well the score are in format of :100%
        const attepmtAverageScoreLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']` +
            `/parent::div //div[contains(@class, 'score-value')]`;
        const actualAverageScore = await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtAverageScoreLocator).innerText();
        console.log(`Attempt ${attemptNumber} Actual average Score: ${actualAverageScore}`);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtAverageScoreLocator)).toHaveText(attemptAverageScore);

        //verfying all three level score in each attempt
        for (let i = 0; i < attemptScores.length; i++) {
            const challengeLevelForScore = i + 1;
            const attepmtScoresLocator = ` //div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div` +
                `//following-sibling::section/div[${challengeLevelForScore}]//div[contains(@class, 'score-value')]`;
            const expectedScore = attemptScores[i];
            const formattedExpectedScore = this.formatScore(expectedScore);
            console.log(`\nExpected score for challengeLevel ${challengeLevelForScore}: ${formattedExpectedScore}`);
            const actualScore = await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtScoresLocator).first().innerText();
            console.log(`Actual score for challengeLevel ${challengeLevelForScore}: ${actualScore}`);
            await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtScoresLocator).first()).toHaveText(`: ${formattedExpectedScore}`);
        }

        await this.verifyPreviouslyCompletedAndNotReachLevel(attempt, attemptScores, attemptNumber);
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
            let stepScore: any = "";

            // Map the raw action to the corresponding option
            if (rawAction === "CORRECT") {
                stepScore = ": 1";
                selectedOption = testData[level]?.["ideal"];
            } else if (rawAction === "INCORRECT") {
                selectedOption = testData[level]?.["incorrect"];
                stepScore = ": 0";
            } else if (rawAction === "DISTRACTOR") {
                selectedOption = testData[level]?.["distractor"];
                stepScore = ": 0";
            }
            //verifying selectedoption for each step with their score .
            //here ican add those logic for first and last text
           
            const userResponse = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
                `/div[${challengeLevel}]` +
                `/div[2]/div[${responseNumber}]//div[contains(@class, 'user-response-text')]`;

            const stepScoreLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
                `/div[${challengeLevel}]` +
                `/div[2]/div[${responseNumber}]//div[contains(@class, 'response-score-value')]`;

            // Assert that the element text matches the expected selectedOption
            await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(stepScoreLocator)).toHaveText(stepScore);
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
                patientResponseData.patientMood,
                patientResponseData.patientResponse2,
                patientResponseData.patientMood2,
                patientResponseData.actionType,
                patientResponseData.level
            );

            // Report response should still be based on the current step
            let reportResponse = null;

            // Map the current raw action to the corresponding option
            if (rawAction === "CORRECT") {
                reportResponse = testData[level]?.["ideal_reportFeedback"];
            } else if (rawAction === "INCORRECT") {
                reportResponse = testData[level]?.["incorrect_reportFeedback"];
            } else if (rawAction === "DISTRACTOR") {
                reportResponse = testData[level]?.["distractor_reportFeedback"];
            }

            const reportResponseLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
                `/div[${challengeLevel}]` +
                `/div[2]/div[${responseNumber}]//div[contains(@class, 'score-msg')]//div[2]`;

            // Assert that the element text matches the expected selectedOption
            await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(reportResponseLocator)).toHaveText(reportResponse);
        }
    }

    private async verifyPatientResponseAndMood(
        attemptNumber: number,
        challengeLevel: number,
        responseNumber: number,
        expectedResponse: string,
        expectedMood: string,
        expectedResponse2: string,
        expectedMood2: string,
        actionType:any,
        level:any
    ) {
        console.log(`\n Verifying patient response for Attempt ${attemptNumber}, Level ${challengeLevel}, Response ${responseNumber}`);
        console.log(`==========================================================================================================`);
        const baseLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
            `/div[${challengeLevel}]` +
            `/div[2]/div[${responseNumber}]`;

        const responseLocator = `${baseLocator}//div[contains(@class, 'patient-response-text')]`;
        const moodLocator = `${baseLocator}//div[contains(@class, 'patient-reaction')]`;

        // Verify patient response text
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(responseLocator))
            .toHaveText(expectedResponse);

        // Verify patient mood text
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(moodLocator))
            .toHaveText("[" + expectedMood + "]");
        if (actionType=="CORRECT"&& level =="C3"){
             await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(responseLocator))
            .toHaveText(expectedResponse2);

        // Verify patient mood text
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(moodLocator))
            .toHaveText("[" + expectedMood2 + "]");
        }
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
                patientResponse: testData["default_chat"]["Emily"],
                patientMood: testData["default_chat"]["Emily_reply_mood"],
                patientResponse2: null,
                patientMood2: null,
                actionType:null,
                level:null
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
            patientResponse: testData["default_chat"]["Emily"],
            patientMood: testData["default_chat"]["Emily_reply_mood"],
            patientResponse2: null,
            patientMood2: null,
            actionType:null,
            level:null
        };
    }

    private getResponseDataForAction(actionType: string, level: string, testData: any) {
    let patientResponse = null;
    let patientMood = null;
    let patientResponse2 = null;
    let patientMood2 = null;

    // Check for special level conditions first
    const isC1Level = level === "C1" || level === "C1.1" || level === "C1.2";
    const isC3Level = level === "C3";
    //console.log(level);
    switch (actionType) {
        case "CORRECT":
            if (isC1Level) {
                patientResponse = testData[level]?.["ideal_reply3"];
                patientMood = testData[level]?.["ideal_reply_mood3"];
            } else if (isC3Level) {
                patientResponse = testData[level]?.["ideal_reply"];
                patientMood = testData[level]?.["ideal_reply_mood"];
                patientResponse2 = testData[level]?.["ideal_reply3"];
                patientMood2 = testData[level]?.["ideal_reply_mood3"];
            } else {
                patientResponse = testData[level]?.["ideal_reply"];
                patientMood = testData[level]?.["ideal_reply_mood"];
            }
            break;
        case "INCORRECT":
            patientResponse = testData[level]?.["incorrect_reply"];
            patientMood = testData[level]?.["incorrect_reply_mood"];
            break;
        case "DISTRACTOR":
            patientResponse = testData[level]?.["distractor_reply"];
            patientMood = testData[level]?.["distractor_reply_mood"];
            
            break;
        default:
            patientResponse = testData["default_chat"]["Ricardo_Gonzalez"];
            patientMood = testData["default_chat"]["Ricardo_Gonzalez_reply_mood"];
    }
    
    return { patientResponse, patientMood,patientResponse2,patientMood2,actionType,level };
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
    //             patientResponse = testData["default_chat"]["Emily"];
    //             patientMood = testData["default_chat"]["Emily_reply_mood"];
    //     }
    //     return { patientResponse, patientMood };
    // }

    private formatScore(score: number): string {
        let formattedScore: string;

        if (score % 1 === 0) {
            formattedScore = score.toString();
        } else {
            const scoreWithDecimals = score.toFixed(2);
            formattedScore = scoreWithDecimals.replace(/\.?0+$/, '');
            if (!formattedScore.includes('.')) {
                formattedScore = score.toFixed(1);
            }
        }
        return `${formattedScore}%`;
    }

    public async verifyPreviouslyCompletedAndNotReachLevel(attempt: string[], attemptScores: number[], attemptNumber: number) {
        const firstStep = attempt[0];
        const [level, rawAction] = firstStep.split("_");
        const firstChallengeLevel = level.startsWith('C') ? parseInt(level.substring(1)) : 0;
        
        const lastStep = attempt[attempt.length - 1];
        const [level1, rawAction1] = lastStep.split("_");
        const lastChallengeLevel = level1.startsWith('C') ? parseInt(level1.substring(1)) : 0;
        
        if (firstChallengeLevel > 1) {
            // Loop from 1 to firstChallengeLevel-1
            for (let i = 1; i < firstChallengeLevel; i++) {
                const textLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
                    `/div[${i}]//div[contains(@class ,'empty-response-box')]/div/p`
                await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(textLocator)).toHaveText("You have cleared this challenge level in your previous attempt.");
            }
        }
        
        if (lastChallengeLevel < this.MAX_CHALLENGE_LEVELS) {
            // Loop from lastChallengeLevel+1 to MAX_CHALLENGE_LEVELS
            for (let i = lastChallengeLevel + 1; i <= this.MAX_CHALLENGE_LEVELS; i++) {
                const textLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']//ancestor::h3/parent::div//following-sibling::section` +
                    `/div[${i}]//div[contains(@class ,'empty-response-box')]/div/p`
                console.log(`Verifying text for iteration ${i} (last range)`);
                await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(textLocator)).toHaveText("You did not clear the previous challenge level to progress to this one.");
            }
        }
    }
}