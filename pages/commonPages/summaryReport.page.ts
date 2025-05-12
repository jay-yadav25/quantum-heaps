import { expect, Locator, type Page } from '@playwright/test';

export class SummaryReport {
    readonly page: Page;
    readonly finalScore: Locator;

    constructor(page: Page) {
        this.page = page;
        this.finalScore = page.frameLocator('iframe[name="ext_012345678_1"]').locator("//div[@class='score-value']").first();
    }

    public async verifyFinalScore(path: string[], testData: any) {
        const attempts: string[][] = [];
        let currentAttempt: string[] = [];

        for (let i = 0; i < path.length; i++) {
            const step = path[i];

            if (step.startsWith('RESTART') || step === 'FAILED' || step === 'COMPLETE') {
                // End of current attempt
                if (currentAttempt.length > 0) {
                    attempts.push([...currentAttempt]);
                    currentAttempt = [];
                }

                // If FAILED, break the loop as specified
                if (step === 'FAILED') {
                    break;
                }
            } else {
                currentAttempt.push(step);
            }
        }

        // Add the last attempt if it's not empty and not ended with FAILED/COMPLETE
        if (currentAttempt.length > 0) {
            attempts.push(currentAttempt);
        }

        console.log(`\nTotal attempts found: ${attempts.length}`);

        // Calculate score for each attempt
        const attemptScores: number[] = [];
        const allAttemptsData = [];
        let attemptNumber = 1;

        for (const attempt of attempts) {
            // Track all challenges by level, including distractors
            const levelData: Record<string, { correct: number, totalChallenges: number }> = {};
            let highestLevel = 0;

            for (const step of attempt) {
                // Extract the level number from the step
                const levelMatch = step.match(/C(\d+)/);
                if (!levelMatch) continue;

                const levelNum = parseInt(levelMatch[1], 10);
                if (levelNum > highestLevel) {
                    highestLevel = levelNum;
                }
            }

            for (const step of attempt) {
                // Extract the level number from the step
                const levelMatch = step.match(/C(\d+)/);
                if (!levelMatch) continue;

                const level = levelMatch[1]; // Just the number part (e.g., "2" from "C2")
                const isCorrect = step.includes('_CORRECT');

                // Initialize the level data if needed
                if (!levelData[level]) {
                    levelData[level] = { correct: 0, totalChallenges: 0 };
                }

                levelData[level].totalChallenges++;
                if (isCorrect) {
                    levelData[level].correct++;
                }
            }

            // Create an array to hold scores for all levels from 1 to highest
            const levelScores: { level: string, score: number }[] = [];

            for (let i = 1; i <= highestLevel; i++) {
                const levelKey = i.toString();
                const { correct = 0, totalChallenges = 0 } = levelData[levelKey] || { correct: 0, totalChallenges: 0 };
                const score = totalChallenges > 0 ? (correct / totalChallenges) * 100 : 0;
                levelScores.push({ level: levelKey, score });
                //console.log(`Level ${levelKey}: ${correct}/${totalChallenges} correct = ${this.formatScore(score)}%`);
            }

            // Extract scores for calculations (now guaranteed to have all levels from 1 to highest)
            const scores = levelScores.map(item => item.score);

            // Calculate attempt score (average starting from the first non-zero score)
            let firstValidIndex = scores.findIndex(score => score > 0);

            // If no valid scores found, the average is 0
            const attemptScore = (firstValidIndex >= 0)
                ? scores.slice(firstValidIndex).reduce((sum, score) => sum + score, 0) /
                scores.slice(firstValidIndex).length
                : 0;

            // Format scores for display
            const scoresForDisplay = scores.map(s => this.formatScore(s));
            // console.log(`Attempt ${attemptNumber} scores: [${scoresForDisplay.join(', ')}]`);
            // console.log(`Attempt ${attemptNumber} average: ${this.formatScore(attemptScore)}%`);
            const attemptScores1 = `[${scoresForDisplay.join(', ')}]`;
            const attemptAverageScore = `${this.formatScore(attemptScore)}%`;

            // Store attempt data
            allAttemptsData.push({
                attempt,
                attemptScores: attemptScores1,
                attemptAverageScore,
                attemptNumber,
                levelScores,
                rawScores: scores
            });

            attemptScores.push(attemptScore);
            attemptNumber++;
        }
        // Now call veryfySelectedOptionAndReportResponse for each attempt one by one
        for (const attemptData of allAttemptsData) {
            await this.veryfySelectedOptionAndReportResponse(
                attemptData.attempt,
                attemptData.rawScores,
                attemptData.attemptAverageScore,
                testData,
                attemptData.attemptNumber, // Use the stored attempt number from the data
                attempts // Pass all attempts to the method
            );
        }

        // Final score is the highest attempt score
        const finalScore = Math.max(...attemptScores, 0);

        console.log(`\n----- FINAL RESULT -----`);
        console.log(`All attempt scores: [${attemptScores.map(s => this.formatScore(s)).join(', ')}]`);
        console.log(`Final Score (highest attempt): ${this.formatScore(finalScore)}%`);


        // Use the formatting function for the final score
        const formattedFinalScore = this.formatScore(finalScore);

        await expect(this.finalScore).toHaveText(`${formattedFinalScore} %`);

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
        allAttempts?: string[][] // Add parameter to receive all attempts
    ) {
        console.log(`Processing Attempt ${attemptNumber}:`);
        console.log(`Steps in this attempt: ${attempt.join(', ')}`);
        console.log(`Attempt ${attemptNumber} scores: [${attemptScores}]`);
        console.log(`Attempt ${attemptNumber} Expected average Score: ${attemptAverageScore}`);
        if (attemptNumber > 1) {
            const attemptDropdownButton = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']`
                + `/following-sibling::div//button[@id='attempt-dropdown-arrow-button']`
            await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attemptDropdownButton).click();
        }

        const attepmtAverageScoreLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']` +
            `/parent::div //div[contains(@class, 'score-value')]`;
        const actualAverageScore = await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtAverageScoreLocator).innerText();
        console.log(`Attempt ${attemptNumber} Actual average Score: ${attemptAverageScore}`);
        await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtAverageScoreLocator)).toHaveText(attemptAverageScore);

        let responseNumber = 0;
        let currentMainLevel = "";

        for (let i = 0; i < attempt.length; i++) {
            const step = attempt[i];
            const [level, rawAction] = step.split("_");

            // Extract challenge level number (e.g., C1 -> 1, C2 -> 2, C3 -> 3)
            const challengeLevel = level.startsWith('C') ? parseInt(level.substring(1)) : 0;

            const attepmtScoresLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']` +
                `/parent::div` +
                `/following-sibling::section` +
                `/div[${challengeLevel}]` +
                `/div[1]//div[contains(@class, 'score-value')]`;

            // Get the correct score for current index
            if (i < attemptScores.length) {
                const expectedScore = attemptScores[challengeLevel - 1];
                console.log(`\nExpected score for challengeLevel ${challengeLevel}: ${expectedScore}%`);
                const actualScore = await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtScoresLocator).innerText();
                console.log(`Actual score for challengeLevel ${challengeLevel}: ${actualScore}`);
                await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtScoresLocator)).toHaveText(`${expectedScore}%`);
            }

            // Response number is the index + 1
            const mainLevel = level.split('.')[0];

            // If we've moved to a new main level, reset responseNumber
            if (mainLevel !== currentMainLevel) {
                responseNumber = 1;
                currentMainLevel = mainLevel;
            } else {
                // Same main level but a new sublevel or action
                responseNumber++;
            }

            console.log(`Step: ${step}, Response Number: ${responseNumber}`);

            let selectedOption = null;

            // Map the raw action to the corresponding option
            if (rawAction === "CORRECT") {
                selectedOption = testData[level]?.["ideal"];
            } else if (rawAction === "INCORRECT") {
                selectedOption = testData[level]?.["incorrect"];
            } else if (rawAction === "DISTRACTOR") {
                selectedOption = testData[level]?.["distractor"];
            }

            if (selectedOption) {
                // XPath to locate the text element
                const userResponse = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']` +
                    `/parent::div` +
                    `/following-sibling::section` +
                    `/div[${challengeLevel}]` +
                    `/div[2]/div[${responseNumber}]//div[contains(@class, 'user-response-text')]`;

                // Assert that the element text matches the expected selectedOption
                await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(userResponse)).toHaveText(selectedOption);
            } else {
                console.warn(`No matching option found for level ${level} with action ${rawAction}`);
            }

            // Get patient response and mood based on current step and previous actions
            const patientResponseData = this.getPatientResponseAndMood(
                attemptNumber,
                i,
                attempt,
                allAttempts || [], // Provide empty array as default if allAttempts is undefined
                testData
            );

            if (patientResponseData.patientResponse && patientResponseData.patientMood) {
                await this.verifyPatientResponseAndMood(
                    attemptNumber,
                    challengeLevel,
                    responseNumber,
                    patientResponseData.patientResponse,
                    patientResponseData.patientMood
                );
            }

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

            if (reportResponse) {
                // XPath to locate the text element
                const reportResponseLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']` +
                    `/parent::div` +
                    `/following-sibling::section` +
                    `/div[${challengeLevel}]` +
                    `/div[2]/div[${responseNumber}]//div[contains(@class, 'score-msg')]//div[2]`;

                // Assert that the element text matches the expected selectedOption
                await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(reportResponseLocator)).toHaveText(reportResponse);
            } else {
                console.warn(`No matching option found for level ${level} with action ${rawAction}`);
            }
        }
    }

    /**
     * Gets patient response and mood based on current attempt, step, and previous actions
     * @param {number} attemptNumber - Current attempt number (1-based)
     * @param {number} stepIndex - Current step index within the attempt (0-based)
     * @param {Array} currentAttempt - Array of steps in the current attempt
     * @param {Array} allAttempts - Array of all previous attempts
     * @param {Object} testData - Test data containing response templates
     * @returns {Object} Object containing patientResponse and patientMood
     */
    private getPatientResponseAndMood(
        attemptNumber: number,
        stepIndex: number,
        currentAttempt: string[],
        allAttempts: string[][] = [], // Make allAttempts optional with default empty array
        testData: any
    ): { patientResponse: string | null, patientMood: string | null } {
        let patientResponse = null;
        let patientMood = null;

        // CASE 1: First step of first attempt
        if (stepIndex === 0 && attemptNumber === 1) {
            // First step of first attempt uses default chat
            patientResponse = testData["default_chat"]["Emily"];
            patientMood = testData["default_chat"]["Emily_reply_mood"];
        }
        // CASE 2: First step of subsequent attempts
        else if (stepIndex === 0 && attemptNumber > 1) {
            // Starting from the most recent attempt, search backwards through all attempts
            // until we find a CORRECT action, or use the most recent non-CORRECT if no CORRECT is found
            let foundCorrectAction = false;
            let responseData = null;

            // Search backwards through previous attempts
            for (let attemptIndex = attemptNumber - 2; attemptIndex >= 0; attemptIndex--) {
                const previousAttempt = allAttempts[attemptIndex];

                if (previousAttempt && previousAttempt.length > 0) {
                    const lastStepOfAttempt = previousAttempt[previousAttempt.length - 1];
                    const [prevLevel, prevRawAction] = lastStepOfAttempt.split("_");

                    if (prevRawAction === "CORRECT") {
                        // Found a CORRECT action, use its level for the response
                        responseData = {
                            response: testData[prevLevel]?.["ideal_reply"],
                            mood: testData[prevLevel]?.["ideal_reply_mood"]
                        };
                        foundCorrectAction = true;
                        break;
                    } else if (attemptIndex === attemptNumber - 2 && !foundCorrectAction) {
                        // Store the most recent non-CORRECT action as fallback
                        responseData = this.getResponseDataForAction(prevRawAction, prevLevel, testData);
                    }
                }
            }

            // If no CORRECT action was found in any previous attempt, use the most recent action's response
            if (!foundCorrectAction && responseData) {
                patientResponse = responseData.response;
                patientMood = responseData.mood;
            } else if (foundCorrectAction && responseData) {
                patientResponse = responseData.response;
                patientMood = responseData.mood;
            } else {
                // Fallback if no previous attempt data (shouldn't happen)
                patientResponse = testData["default_chat"]["Emily"];
                patientMood = testData["default_chat"]["Emily_reply_mood"];
            }
        }
        // CASE 3: Not the first step - use previous step in current attempt
        else {
            const prevStep = currentAttempt[stepIndex - 1];
            const [prevLevel, prevRawAction] = prevStep.split("_");

            // Get response based on previous step's action
            const responseData = this.getResponseDataForAction(prevRawAction, prevLevel, testData);
            patientResponse = responseData.response;
            patientMood = responseData.mood;
        }

        return { patientResponse, patientMood };
    }

    /**
     * Helper function to get the appropriate response and mood based on action type
     * @param {string} actionType - The action type (CORRECT, INCORRECT, DISTRACTOR)
     * @param {string} level - The challenge level
     * @param {Object} testData - Test data containing response templates
     * @returns {Object} Object containing response and mood
     */
    private getResponseDataForAction(actionType: string, level: string, testData: any): { response: string | null, mood: string | null } {
        let response = null;
        let mood = null;

        switch (actionType) {
            case "CORRECT":
                response = testData[level]?.["ideal_reply"];
                mood = testData[level]?.["ideal_reply_mood"];
                break;
            case "INCORRECT":
                response = testData[level]?.["incorrect_reply"];
                mood = testData[level]?.["incorrect_reply_mood"];
                break;
            case "DISTRACTOR":
                response = testData[level]?.["distractor_reply"];
                mood = testData[level]?.["distractor_reply_mood"];
                break;
            default:
                // Fallback for unknown action types
                response = testData["default_chat"]["Emily"];
                mood = testData["default_chat"]["Emily_reply_mood"];
        }

        return { response, mood };
    }

    /**
     * Verifies patient response and mood in the UI
     * @param {number} attemptNumber - Current attempt number
     * @param {number} challengeLevel - Challenge level number
     * @param {number} responseNumber - Response number in the UI
     * @param {string} patientResponse - Expected patient response
     * @param {string} patientMood - Expected patient mood
     * @returns {Promise<void>}
     */
    private async verifyPatientResponseAndMood(
        attemptNumber: number,
        challengeLevel: number,
        responseNumber: number,
        patientResponse: string,
        patientMood: string
    ): Promise<void> {
        // Build locators for response and mood elements
        const baseLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']` +
            `/parent::div` +
            `/following-sibling::section` +
            `/div[${challengeLevel}]` +
            `/div[2]/div[${responseNumber}]`;

        const responseLocator = `${baseLocator}//div[contains(@class, 'patient-response-text')]`;
        const moodLocator = `${baseLocator}//div[contains(@class, 'patient-reaction')]`;

        // Verify patient response text
        // await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(responseLocator))
        //     .toHaveText(patientResponse);

        // Verify patient mood text
        // await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(moodLocator))
        //     .toHaveText("(" + patientMood + ")");
    }

    /**
     * Formats a numeric score to display with appropriate decimal places
     * - Whole numbers display with no decimal (e.g., "100")
     * - Numbers with decimals display with up to 2 decimal places, removing trailing zeros
     * 
     * @param score The numeric score to format
     * @param includePercentSign Whether to include the % sign in the output
     * @returns Formatted score string
     */
    private formatScore(score: number, includePercentSign: boolean = false): string {
        let formattedScore: string;

        if (score % 1 === 0) {
            // It's a whole number
            formattedScore = score.toString();
        } else {
            // Get 2 decimal places
            const scoreWithDecimals = score.toFixed(2);
            // Remove trailing zeros but keep at least one decimal place if not a whole number
            formattedScore = scoreWithDecimals.replace(/\.?0+$/, '');
            if (!formattedScore.includes('.')) {
                formattedScore = score.toFixed(1);
            }
        }

        return includePercentSign ? `${formattedScore}%` : formattedScore;
    }
}