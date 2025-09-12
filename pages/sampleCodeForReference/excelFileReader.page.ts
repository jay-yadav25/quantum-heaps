import { expect, type Locator, type Page } from '@playwright/test';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';

export class DiagnosticTesting {
  readonly page: Page;
  readonly stepIntroductionContinueButton: Locator;
  readonly iframeLocator: Locator;
  readonly goToNextStepButton: Locator;
  readonly tipOfRingFingerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.iframeLocator = page.locator("iframe[name='ext_012345678_1']");
    const frameLocator = this.iframeLocator.contentFrame();
    this.stepIntroductionContinueButton = frameLocator.getByRole('button', { name: 'Continue' });
    this.goToNextStepButton = frameLocator.getByRole('button', { name: 'Go to next step Continue' });
    this.tipOfRingFingerButton = frameLocator.getByRole('button', { name: 'Tip of the ring finger' });
  }

  public async clickOnContonueButton() {
    await this.stepIntroductionContinueButton.click();
  }

  public async selectInstruments(instrumentName: string[]) {
    for (let i = 0; i < instrumentName.length; i++) {
      const buttonName = instrumentName[i];
      const frameLocator = this.iframeLocator.contentFrame();
      const instrumentButton: Locator = frameLocator.getByRole('button', { name: buttonName }).first();
      console.log(instrumentButton);
      await instrumentButton.click();
    }
  }

  public async deselectIncorrectInstruments(instrumentName: string[]) {
    if (instrumentName.length >= 2) {
      for (let i = 0; i < instrumentName.length - 1; i++) {
        const buttonName = instrumentName[i];
        const frameLocator = this.iframeLocator.contentFrame();
        const instrumentButton: Locator = frameLocator.getByRole('button', { name: buttonName }).first();
        await instrumentButton.click();
        //await this.page.waitForTimeout(6000);
      }
    }
  }

  public async readExcelFile() {
    const filePath = path.join("D:/CENGAGE/DHO/fixtures/automation/diagnosticTesting", "newSB.xlsx");

    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return;
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0]; // Read the first sheet

    let stepTitleIndex = -1;
    let introductionIndex = -1;

    // Read header row to find column indexes
    worksheet.getRow(2).eachCell((cell, colNumber) => {
      if (cell.value === "Step Title") {
        stepTitleIndex = colNumber;
      } else if (cell.value === "Instructions") {
        introductionIndex = colNumber;
      }
    });

    if (stepTitleIndex === -1 || introductionIndex === -1) {
      console.error("Not found.");
      return;
    }

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const name = row.getCell(stepTitleIndex).value;
      if (name === "Note Patient's Height") {
        const Instructions = row.getCell(introductionIndex).value;
        console.log(Instructions);
      }
    });

  }




}