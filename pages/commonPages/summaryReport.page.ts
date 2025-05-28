import { expect, Locator, type Page } from '@playwright/test';

export class SummaryReport {
    readonly page: Page;
    readonly finalScore: Locator;

    constructor(page: Page) {
        this.page = page;
        this.finalScore = page.frameLocator('iframe[name="ext_012345678_1"]').locator("//div[@class='score-value']").first();
    }

    // public async verifyFinalScore(path: string[], testData: any) {
    //     const attempts: string[][] = [];
    //     let currentAttempt: string[] = [];
    //     for (let i = 0; i < path.length; i++) {
    //         const step = path[i];

    //         if (step.startsWith('SUBMIT') || step.startsWith('RESTART') || step === 'FAILED' || step === 'COMPLETE') {
    //             if (currentAttempt.length > 0) {
    //                 attempts.push([...currentAttempt]);
    //                 currentAttempt = [];
    //             }
    //             if (step === 'FAILED' || step.startsWith('SUBMIT')) {
    //                 break;
    //             }
    //         } else {
    //             currentAttempt.push(step);
    //         }
    //     }
    //     // Add the last attempt if it's not empty and not ended with FAILED/COMPLETE
    //     if (currentAttempt.length > 0) {
    //         attempts.push(currentAttempt);
    //     }

    //     console.log(`\nTotal attempts found: ${attempts.length}`);

    //     // Calculate score for each attempt
    //     const attemptScores: number[] = [];
    //     const allAttemptsData = [];
    //     let attemptNumber = 1;

    //     for (const attempt of attempts) {
    //         const levelData: Record<string, { correct: number, totalChallenges: number }> = {};
    //         let highestLevel = 0;

    //         for (const step of attempt) {
    //             const levelMatch = step.match(/C(\d+)/);
    //             if (!levelMatch) continue;
    //             const levelNum = parseInt(levelMatch[1], 10);
    //             if (levelNum > highestLevel) {
    //                 highestLevel = levelNum;
    //             }
    //         }

    //         for (const step of attempt) {
    //             const levelMatch = step.match(/C(\d+)/);
    //             if (!levelMatch) continue;
    //             const level = levelMatch[1];
    //             const isCorrect = step.includes('_CORRECT');
    //             if (!levelData[level]) {
    //                 levelData[level] = { correct: 0, totalChallenges: 0 };
    //             }

    //             levelData[level].totalChallenges++;
    //             if (isCorrect) {
    //                 levelData[level].correct++;
    //             }
    //         }
    //         const levelScores: { level: string, score: number }[] = [];
    //         for (let i = 1; i <= highestLevel; i++) {
    //             const levelKey = i.toString();
    //             const { correct = 0, totalChallenges = 0 } = levelData[levelKey] || { correct: 0, totalChallenges: 0 };
    //             const score = totalChallenges > 0 ? (correct / totalChallenges) * 100 : 0;
    //             levelScores.push({ level: levelKey, score });
    //         }
    //         const scores = levelScores.map(item => item.score);
    //         let firstValidIndex = scores.findIndex(score => score > 0);
    //         const attemptScore = (firstValidIndex >= 0)
    //             ? scores.slice(firstValidIndex).reduce((sum, score) => sum + score, 0) /
    //             scores.slice(firstValidIndex).length
    //             : 0;
    //         const scoresForDisplay = scores.map(s => this.formatScore(s));
    //         const attemptScores1 = `[${scoresForDisplay.join(', ')}]`;
    //         const attemptAverageScore = `${this.formatScore(attemptScore)}%`;
    //         allAttemptsData.push({
    //             attempt,
    //             attemptScores: attemptScores1,
    //             attemptAverageScore,
    //             attemptNumber,
    //             levelScores,
    //             rawScores: scores
    //         });

    //         attemptScores.push(attemptScore);
    //         attemptNumber++;
    //     }
    //     for (const attemptData of allAttemptsData) {
    //         await this.veryfySelectedOptionAndReportResponse(
    //             attemptData.attempt,
    //             attemptData.rawScores,
    //             attemptData.attemptAverageScore,
    //             testData,
    //             attemptData.attemptNumber,
    //             attempts
    //         );
    //     }

    //     const finalScore = Math.max(...attemptScores, 0);
    //     console.log(`\n----- FINAL RESULT -----`);
    //     console.log(`All attempt scores: [${attemptScores.map(s => this.formatScore(s)).join(', ')}]`);
    //     console.log(`Final Score (highest attempt): ${this.formatScore(finalScore)}%`);
    //     const formattedFinalScore = this.formatScore(finalScore);
    //     await expect(this.finalScore).toHaveText(`${formattedFinalScore} %`);
    //     return {
    //         finalScore,
    //         attemptScores,
    //         allAttemptsData
    //     };
    // }
    public async verifyFinalScore(path: string[], testData: any) {
        const attempts: string[][] = [];
        let currentAttempt: string[] = [];
        for (let i = 0; i < path.length; i++) {
            const step = path[i];

            if (step.startsWith('SUBMIT') || step.startsWith('RESTART') || step === 'FAILED' || step === 'COMPLETE') {
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
        // Add the last attempt if it's not empty and not ended with FAILED/COMPLETE
        if (currentAttempt.length > 0) {
            attempts.push(currentAttempt);
        }

        console.log(`\nTotal attempts found: ${attempts.length}`);

        // Calculate score for each attempt with carry-forward logic
        const attemptScores: number[] = [];
        const allAttemptsData = [];
        let attemptNumber = 1;

        // Object to track the best scores for each level across all attempts
        const bestLevelScores: Record<string, { correct: number, totalChallenges: number }> = {};
        const highestLevelReached: Record<number, number> = {}; // attempt number -> highest level

        // First pass to collect all level data across attempts
        for (let i = 0; i < attempts.length; i++) {
            const attempt = attempts[i];
            const currentAttemptLevelData: Record<string, { correct: number, totalChallenges: number }> = {};
            let highestLevel = 0;

            // Process the current attempt to get level data
            for (const step of attempt) {
                const levelMatch = step.match(/C(\d+)/);
                if (!levelMatch) continue;

                const level = levelMatch[1];
                const levelNum = parseInt(level, 10);
                const isCorrect = step.includes('_CORRECT');

                if (levelNum > highestLevel) {
                    highestLevel = levelNum;
                }

                if (!currentAttemptLevelData[level]) {
                    currentAttemptLevelData[level] = { correct: 0, totalChallenges: 0 };
                }

                currentAttemptLevelData[level].totalChallenges++;
                if (isCorrect) {
                    currentAttemptLevelData[level].correct++;
                }
            }

            highestLevelReached[i + 1] = highestLevel;

            // Update the best level scores
            for (const [level, data] of Object.entries(currentAttemptLevelData)) {
                if (!bestLevelScores[level]) {
                    bestLevelScores[level] = { correct: 0, totalChallenges: 0 };
                }

                // If this level was played in this attempt, update the totalChallenges regardless
                bestLevelScores[level].totalChallenges = Math.max(
                    bestLevelScores[level].totalChallenges,
                    data.totalChallenges
                );

                // Update the correct count if we have a better score
                if (data.correct > bestLevelScores[level].correct) {
                    bestLevelScores[level].correct = data.correct;
                }
            }
        }

        // Second pass to calculate scores for each attempt with carry-forward logic
        let cumulativeAttemptData: Record<string, { correct: number, totalChallenges: number }> = {};

        for (let i = 0; i < attempts.length; i++) {
            const attempt = attempts[i];
            const currentAttemptNum = i + 1;
            const currentAttemptLevelData: Record<string, { correct: number, totalChallenges: number }> = {};

            // Get level data for this specific attempt
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

            // Apply carry-forward logic: inherit previous level scores if not in current attempt
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
                    // If we don't have data for this level but it's before the highest level,
                    // add a zero score
                    levelScores.push({ level: levelKey, score: 0 });
                }
            }

            // Calculate average score - always divide by 3 levels
            const scores = levelScores.map(item => item.score);
            // Add 0% for any missing levels up to level 3
            const paddedScores = [...scores];
            while (paddedScores.length < 3) {
                paddedScores.push(0);
            }
            // For levels beyond 3, we still include them in the calculation
            const totalLevels = Math.max(3, scores.length);
            const attemptScore = scores.reduce((sum, score) => sum + score, 0) / totalLevels;

            const scoresForDisplay = scores.map(s => this.formatScore(s));
            const attemptScores1 = `[${scoresForDisplay.join(', ')}]`;
            const attemptAverageScore = `: ${this.formatScore(attemptScore)}%`;

            allAttemptsData.push({
                attempt,
                attemptScores: attemptScores1,
                attemptAverageScore,
                attemptNumber: currentAttemptNum,
                levelScores,
                rawScores: scores
            });

            attemptScores.push(attemptScore);
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
        console.log(`Final Score (highest attempt): ${this.formatScore(finalScore)}%`);
        const formattedFinalScore = this.formatScore(finalScore);
        await expect(this.finalScore).toHaveText(`${formattedFinalScore}%`);
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
            const attemptDropdownButton = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']`
                + `/following-sibling::button[@id='attempt-dropdown-arrow-button']`
            await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attemptDropdownButton).click();
        }

        const attepmtAverageScoreLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']` +
            `/parent::div //div[contains(@class, 'score-value')]`;
        const actualAverageScore = await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtAverageScoreLocator).innerText();
        console.log(`Attempt ${attemptNumber} Actual average Score: ${actualAverageScore}`);
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
                const formattedExpectedScore = this.formatScore(expectedScore);
                console.log(`\nExpected score for challengeLevel ${challengeLevel}: ${formattedExpectedScore}%`);
                const actualScore = await this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtScoresLocator).innerText();
                console.log(`Actual score for challengeLevel ${challengeLevel}: ${actualScore}`);
                await expect(this.page.frameLocator('iframe[name="ext_012345678_1"]').locator(attepmtScoresLocator)).toHaveText(`: ${formattedExpectedScore}%`);
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

            console.log(`\nStep: ${step}, Response Number: ${responseNumber}`);

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

    private async verifyPatientResponseAndMood(
        attemptNumber: number,
        challengeLevel: number,
        responseNumber: number,
        expectedResponse: string,
        expectedMood: string
    ) {
        console.log(`\n Verifying patient response for Attempt ${attemptNumber}, Level ${challengeLevel}, Response ${responseNumber}`);
        console.log(`Expected response: ${expectedResponse}`);
        console.log(`Expected mood: ${expectedMood}`);
        console.log(`==========================================================================================================`);
        const baseLocator = `//div[@class='attempt-title' and normalize-space(text())='Attempt ${attemptNumber}']` +
            `/parent::div` +
            `/following-sibling::section` +
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
    }


    private getPatientResponseAndMood(
        attemptNumber: number,
        stepIndex: number,
        currentAttempt: string[],
        allAttempts: string[][] = [], // Make allAttempts optional with default empty array
        testData: any
    ): { patientResponse: string | null, patientMood: string | null } {
        console.log(`Getting patient response for attempt ${attemptNumber}, step ${stepIndex}`);

        // CASE 1: First step of first attempt - always use default response
        if (attemptNumber === 1 && stepIndex === 0) {
            console.log(`CASE 1: First step of first attempt - using default response`);
            return {
                patientResponse: testData["default_chat"]["Emily"],
                patientMood: testData["default_chat"]["Emily_reply_mood"]
            };
        }

        // CASE 2: Not the first step - use the immediate previous step's response
        if (stepIndex > 0) {
            const prevStep = currentAttempt[stepIndex - 1];
            const [prevLevel, prevRawAction] = prevStep.split("_");
            console.log(`CASE 2: Not first step - using previous step response from ${prevStep}`);
            return this.getResponseDataForAction(prevRawAction, prevLevel, testData);
        }

        // CASE 3: First step of subsequent attempts
        if (stepIndex === 0 && attemptNumber > 1) {
            console.log(`CASE 3: First step of attempt ${attemptNumber}`);

            // Look for the most recent CORRECT action in all previous attempts
            for (let attemptIdx = attemptNumber - 2; attemptIdx >= 0; attemptIdx--) {
                const attempt = allAttempts[attemptIdx];

                if (!attempt || attempt.length === 0) continue;

                // Scan each attempt from end to beginning
                for (let stepIdx = attempt.length - 1; stepIdx >= 0; stepIdx--) {
                    const step = attempt[stepIdx];
                    const [level, rawAction] = step.split("_");

                    if (rawAction === "CORRECT") {
                        console.log(`Found CORRECT action ${step} in attempt ${attemptIdx + 1}, using its response`);

                        return this.getResponseDataForAction(rawAction, level, testData);
                    }
                }
            }

            // If no CORRECT action was found, use the last action of the immediately previous attempt
            const previousAttemptIdx = attemptNumber - 2;
            const previousAttempt = allAttempts[previousAttemptIdx];

            if (previousAttempt && previousAttempt.length > 0) {
                const lastStep = previousAttempt[previousAttempt.length - 1];
                console.log(`No CORRECT action found, using last action deffult`);
                return {
                    patientResponse: testData["default_chat"]["Emily"],
                    patientMood: testData["default_chat"]["Emily_reply_mood"]
                };
            }
        }
        console.warn(`Fallback case - using default response`);
        return {
            patientResponse: testData["default_chat"]["Emily"],
            patientMood: testData["default_chat"]["Emily_reply_mood"]
        };
    }


    private getResponseDataForAction(actionType: string, level: string, testData: any): { patientResponse: string | null, patientMood: string | null } {
        let patientResponse = null;
        let patientMood = null;

        switch (actionType) {
            case "CORRECT":
                patientResponse = testData[level]?.["ideal_reply"];
                patientMood = testData[level]?.["ideal_reply_mood"];
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
                patientResponse = testData["default_chat"]["Emily"];
                patientMood = testData["default_chat"]["Emily_reply_mood"];
        }
        return { patientResponse, patientMood };
    }

    private formatScore(score: number, includePercentSign: boolean = false): string {
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
        return includePercentSign ? `${formattedScore}%` : formattedScore;
    }
}