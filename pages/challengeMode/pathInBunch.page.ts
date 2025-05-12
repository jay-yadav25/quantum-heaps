import { type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

type Resolution = 'COMPLETE' | 'FAILED';
type Step = 'C1' | 'C1.1' | 'C1.1.1' | 'C1.2' | 'C2' | 'C2.1' | 'C3';
type Action = 'CORRECT' | 'INCORRECT' | 'DISTRACTOR';

interface ScenarioPath {
  path: string[];
  attempts: number;
  resolution: Resolution;
}

export class ScenarioWalker1 {
  private readonly page: Page;
  private results: ScenarioPath[] = [];
  private readonly csvFilePath: string;
  private readonly jsonFilePath: string;
  private globalAttempts = 1;
  private totalPathsExplored = 0;
  private jsonResults: Record<string, string[]> = {};

  constructor(page: Page) {
    this.page = page;
    this.csvFilePath = path.join(
      'D:\\CENGAGE\\DHO\\fixtures\\automation\\diagnosticTesting',
      'DentalExcel.csv'
    );
    this.jsonFilePath = path.join(
      'D:\\CENGAGE\\DHO\\fixtures\\automation',
      'loginData.json'
    );
    this.initializeCSV();
  }

  public async exploreAllScenarioPaths(): Promise<ScenarioPath[]> {
    this.results = [];
    this.jsonResults = {};
    this.totalPathsExplored = 0;

    await this.traversePath('C1', [], 1);
    this.saveJsonResults();
    return this.results;
  }

  public printScenarioSummary(): void {
    const complete = this.results.filter(r => r.resolution === 'COMPLETE').length;
    const failed = this.results.filter(r => r.resolution === 'FAILED').length;

    console.log('\n=== SCENARIO EXPLORATION SUMMARY ===');
    console.log(`Total paths explored: ${this.results.length}`);
    console.log(`Maximum attempts used: ${this.globalAttempts}`);
    console.log(`Complete resolutions: ${complete}`);
    console.log(`Failed paths: ${failed}`);

    const summaryText = [
      '\nSUMMARY',
      `Total paths,${this.results.length}`,
      `Complete,${complete}`,
      `Failed,${failed}`,
      `Max attempts,${this.globalAttempts}`
    ].join('\n');

    fs.appendFileSync(this.csvFilePath, summaryText);
  }

  private initializeCSV(): void {
    const dir = path.dirname(this.csvFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.csvFilePath, 'Path,Attempts,Resolution\n');
  }

  private writeToCSV(pathStr: string, attempts: number, resolution: Resolution): void {
    const csvLine = `"${pathStr}",${attempts},${resolution}\n`;
    fs.appendFileSync(this.csvFilePath, csvLine);
  }

  private saveJsonResults(): void {
    fs.writeFileSync(this.jsonFilePath, JSON.stringify(this.jsonResults, null, 2));
  }

  private async traversePath(
    currentStep: Step | 'RESTART',
    currentPath: string[],
    currentAttempt: number
  ): Promise<void> {
    if (currentAttempt > 3) {
      return this.recordResult([...currentPath, 'FAILED'], currentAttempt, 'FAILED');
    }

    this.globalAttempts = Math.max(this.globalAttempts, currentAttempt);

    switch (currentStep) {
      case 'RESTART':
        return await this.handleRestart(currentPath, currentAttempt);
      case 'C3':
        return await this.handleFinalStep(currentPath, currentAttempt);
      default:
        return await this.processStepActions(currentStep, currentPath, currentAttempt);
    }
  }

  private async handleRestart(
    currentPath: string[],
    currentAttempt: number
  ): Promise<void> {
    const lastChallenge = this.findLastChallenge(currentPath);
    let restartStep: Step = 'C1';

    if (lastChallenge?.startsWith('C2')) {
      restartStep = 'C2';
    } else if (lastChallenge === 'C3') {
      restartStep = 'C3';
    }

    return await this.traversePath(
      restartStep,
      [...currentPath, `RESTART${currentAttempt}`],
      currentAttempt + 1
    );
  }

  private async processStepActions(
    step: Step,
    currentPath: string[],
    currentAttempt: number
  ): Promise<void> {
    const actions: Action[] = ['CORRECT', 'INCORRECT', 'DISTRACTOR'];
    for (const action of actions) {
      const newPath = [...currentPath, `${step}_${action}`];
      await this.executeAction(step, action, newPath, currentAttempt);
    }
  }

  private async executeAction(
    step: Step,
    action: Action,
    currentPath: string[],
    currentAttempt: number
  ): Promise<void> {
    const nextStep = this.determineNextStep(step, action);
    await this.traversePath(nextStep, currentPath, currentAttempt);
  }

  private determineNextStep(currentStep: Step, action: Action): Step | 'RESTART' {
    const stepTransitions = {
      'C1': { 'CORRECT': 'C2', 'INCORRECT': 'C1.2', 'DISTRACTOR': 'C1.1' },
      'C1.1': { 'CORRECT': 'C2', 'INCORRECT': 'RESTART', 'DISTRACTOR': 'C1.1.1' },
      'C1.1.1': { 'CORRECT': 'C2', 'INCORRECT': 'RESTART', 'DISTRACTOR': 'RESTART' },
      'C1.2': { 'CORRECT': 'C2', 'INCORRECT': 'RESTART', 'DISTRACTOR': 'RESTART' },
      'C2': { 'CORRECT': 'C3', 'INCORRECT': 'RESTART', 'DISTRACTOR': 'C2.1' },
      'C2.1': { 'CORRECT': 'C3', 'INCORRECT': 'RESTART', 'DISTRACTOR': 'RESTART' },
      'C3': { 'CORRECT': 'C3', 'INCORRECT': 'RESTART', 'DISTRACTOR': 'RESTART' }
    };
    return stepTransitions[currentStep][action] as Step | 'RESTART';
  }

  private async handleFinalStep(
    currentPath: string[],
    currentAttempt: number
  ): Promise<void> {
    const correctPath = [...currentPath, 'C3_CORRECT', 'COMPLETE'];
    this.recordResult(correctPath, currentAttempt, 'COMPLETE');

    const restartActions: Action[] = ['INCORRECT', 'DISTRACTOR'];
    for (const action of restartActions) {
      const actionPath = [...currentPath, `C3_${action}`];
      await this.traversePath('RESTART', actionPath, currentAttempt);
    }
  }

  private findLastChallenge(path: string[]): Step | null {
    for (let i = path.length - 1; i >= 0; i--) {
      const step = path[i];
      if (step.startsWith('C1') || step.startsWith('C2') || step.startsWith('C3')) {
        return step.split('_')[0] as Step;
      }
    }
    return null;
  }

  private recordResult(
    path: string[],
    attempts: number,
    resolution: Resolution
  ): void {
    const pathStr = path.join(' → ');
    this.results.push({ path, attempts, resolution });
    this.totalPathsExplored++;
    console.log(`Path ${this.totalPathsExplored}: ${pathStr}, Attempts: ${attempts}, Result: ${resolution}`);
    this.writeToCSV(pathStr, attempts, resolution);
    this.jsonResults[this.totalPathsExplored] = path;
  }
}
