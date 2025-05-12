import { type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

type Resolution = "COMPLETE" | "PARTIAL" | "FAILED";
type Step = "C1" | "C1.1" | "C1.1.1" | "C1.2" | "C2" | "C2.1" | "C3";
type Action = "CORRECT" | "INCORRECT" | "DISTRACTOR";

interface ScenarioPath {
  path: string[];
  attempts: number;
  resolution: Resolution;
}

export class ScenarioWalker {
  private readonly page: Page;
  private results: ScenarioPath[] = [];
  private readonly csvFilePath: string;
  private globalAttempts = 0;

  constructor(page: Page) {
    this.page = page;
    this.csvFilePath = path.join('D:\\CENGAGE\\CENGAGE-CS\\fixtures\\automation\\diagnosticTesting', 'DentalExcel.csv');
    this.initializeCSV();
  }

  private async selectOption(option: string): Promise<void> {
    // Implement your option selection logic here
    //click on the options then wait for updated chat section 
    // verify tht the user reply is added in the chat section 
    // then verify next set of option is visible or not 
  }

  private async handlePopup(): Promise<void> {
    // Implement your popup handling logic here
    await this.page.getByRole('button', { name: 'RESTART' }).click();
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

  public async exploreScenarioPaths(): Promise<ScenarioPath[]> {
    await this.traversePath("C1", [], 1);
    return this.results;
  }

  private async traversePath(
    currentStep: Step | "RESTART",
    currentPath: string[],
    currentAttempt: number
  ): Promise<void> {
    if (currentAttempt > 3) {
      this.recordResult([...currentPath, "MAX_ATTEMPTS"], currentAttempt, "FAILED");
      return;
    }

    this.globalAttempts = Math.max(this.globalAttempts, currentAttempt);

    if (currentStep === "RESTART") {
      await this.handleRestart(currentPath, currentAttempt);
      return;
    }

    if (currentStep === "C3") {
      await this.handleFinalStep(currentPath, currentAttempt);
      return;
    }

    await this.processStepActions(currentStep, currentPath, currentAttempt);
  }

  private async handleRestart(currentPath: string[], currentAttempt: number): Promise<void> {
    //await this.handlePopup();
    const lastChallenge = this.findLastChallenge(currentPath);
    const restartStep = lastChallenge === "C3" ? "C3" : "C1";
    
    await this.traversePath(
      restartStep, 
      [...currentPath, "RESTART"], 
      currentAttempt + 1
    );
  }

  private async processStepActions(
    step: Step, 
    currentPath: string[], 
    currentAttempt: number
  ): Promise<void> {
    const actions: Action[] = ["CORRECT", "INCORRECT", "DISTRACTOR"];
    
    for (const action of actions) {
      const newPath = [...currentPath, step, action];
      await this.executeAction(step, action, newPath, currentAttempt);
    }
  }

  private async executeAction(
    step: Step,
    action: Action,
    currentPath: string[],
    currentAttempt: number
  ): Promise<void> {
    const option = `${step}${action}`;
    //await this.selectOption(option);
    
    const nextStep = this.determineNextStep(step, action);
    await this.traversePath(nextStep, currentPath, currentAttempt);
  }

  private determineNextStep(currentStep: Step, action: Action): Step | "RESTART" {
    const stepTransitions = {
      "C1": {
        "CORRECT": "C2",
        "INCORRECT": "C1.2",
        "DISTRACTOR": "C1.1"
      },
      "C1.1": {
        "CORRECT": "C2",
        "INCORRECT": "RESTART",
        "DISTRACTOR": "C1.1.1"
      },
      "C1.1.1": {
        "CORRECT": "C2",
        "INCORRECT": "RESTART",
        "DISTRACTOR": "RESTART"
      },
      "C1.2": {
        "CORRECT": "C2",
        "INCORRECT": "RESTART",
        "DISTRACTOR": "RESTART"
      },
      "C2": {
        "CORRECT": "C3",
        "INCORRECT": "RESTART",
        "DISTRACTOR": "C2.1"
      },
      "C2.1": {
        "CORRECT": "C3",
        "INCORRECT": "RESTART",
        "DISTRACTOR": "RESTART"
      },
      "C3": {
        "CORRECT": "C3",
        "INCORRECT": "RESTART",
        "DISTRACTOR": "C3"
      }
    };

    return stepTransitions[currentStep][action] as Step | "RESTART";
  }

  private async handleFinalStep(currentPath: string[], currentAttempt: number): Promise<void> {
    const actions: Action[] = ["CORRECT", "INCORRECT", "DISTRACTOR"];
    
    for (const action of actions) {
        const actionPath = [...currentPath, "C3", action];
      
      //await this.selectOption(`C3${action}`);
      
      if (action === "CORRECT") {
        this.recordResult(actionPath, currentAttempt, "COMPLETE");
      } else if (action === "DISTRACTOR") {
        this.recordResult(actionPath, currentAttempt, "PARTIAL");
      } else {
        await this.traversePath("RESTART", actionPath, currentAttempt);
      }
    }
  }

  private findLastChallenge(path: string[]): Step | null {
    for (let i = path.length - 1; i >= 0; i--) {
      const step = path[i];
      if (step.startsWith("C1") || step.startsWith("C2") || step.startsWith("C3")) {
        return step as Step;
      }
    }
    return null;
  }

  private recordResult(path: string[], attempts: number, resolution: Resolution): void {
    const pathStr = path.join(" → ");
    this.results.push({ path, attempts, resolution });
    console.log(`Path ${this.results.length}: ${pathStr}, Attempts: ${attempts}, Result: ${resolution}`);
    this.writeToCSV(pathStr, attempts, resolution);
  }

  public printScenarioSummary(): void {
    console.log("\n=== SCENARIO EXPLORATION SUMMARY ===");
    console.log(`Total paths explored: ${this.results.length}`);
    console.log(`Maximum attempts used: ${this.globalAttempts}`);
    
    const summary = {
      complete: this.results.filter(r => r.resolution === "COMPLETE").length,
      partial: this.results.filter(r => r.resolution === "PARTIAL").length,
      failed: this.results.filter(r => r.resolution === "FAILED").length
    };
    
    console.log(`Complete resolutions: ${summary.complete}`);
    console.log(`Partial resolutions: ${summary.partial}`);
    console.log(`Failed paths: ${summary.failed}`);
    
    const summaryText = `\nSUMMARY\nTotal paths,${this.results.length}\nComplete,${summary.complete}\nPartial,${summary.partial}\nFailed,${summary.failed}\nMax attempts,${this.globalAttempts}`;
    fs.appendFileSync(this.csvFilePath, summaryText);
  }
}