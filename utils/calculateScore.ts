// utils/calculateScores.ts
export type AttemptScore = {
  attempt: number;
  score: number;
};

/**
 * Calculates score for each attempt based on step history.
 * 
 * @param path Array of steps taken by user (e.g. ["C1_CORRECT", "C1.1_DISTRACTOR", "RESTART1", ...])
 * @returns Array of scores per attempt
 */
export function calculateScores(path: string[]): AttemptScore[] {
  const attemptScores: AttemptScore[] = [];
  let currentAttemptSteps: string[] = [];
  let attemptNumber = 1;

  const finalizeAttempt = (steps: string[]) => {
    const levelMap: Record<string, string[]> = {};

    for (const step of steps) {
      if (step.startsWith('C')) {
        const level = step.split('_')[0]; // e.g. C1, C1.1
        if (!levelMap[level]) levelMap[level] = [];
        levelMap[level].push(step);
      }
    }

    const levelScores: number[] = [];

    for (const level in levelMap) {
      const responses = levelMap[level];
      const total = responses.length;
      const corrects = responses.filter(step => step.endsWith('CORRECT')).length;
      const levelScore = corrects / total;
      levelScores.push(levelScore);
    }

    const attemptScore = levelScores.length > 0
      ? levelScores.reduce((a, b) => a + b, 0) / levelScores.length
      : 0;

    attemptScores.push({
      attempt: attemptNumber++,
      score: parseFloat(attemptScore.toFixed(4))
    });
  };

  for (const step of path) {
    if (step.startsWith('RESTART') || step === 'COMPLETE' || step === 'FAILED') {
      finalizeAttempt(currentAttemptSteps);
      currentAttemptSteps = [];
    } else {
      currentAttemptSteps.push(step);
    }
  }

  if (currentAttemptSteps.length > 0) {
    finalizeAttempt(currentAttemptSteps);
  }

  return attemptScores;
}
