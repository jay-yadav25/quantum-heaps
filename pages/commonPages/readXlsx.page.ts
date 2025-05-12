import * as fs from "fs";
import * as path from "path";
import * as ExcelJS from "exceljs";
import { type Page } from "@playwright/test";

export class ExcelFunction {
    readonly page: Page;
    private readonly BASE_PATH: string = "D:/CENGAGE/CENGAGE-CS/fixtures/automation/diagnosticTesting"; 

    constructor(page: Page) {
        this.page = page;
    }

    public async readExcelValue(
        fileName: string, 
        searchColumn: string, 
        searchValue: string, 
        returnColumn: string
    )  {
        const filePath = path.join(this.BASE_PATH, fileName);

        if (!fs.existsSync(filePath)) {
            console.error("File not found:", filePath);
            return null;
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0]; // Read the first sheet

        let searchColumnIndex = -1;
        let returnColumnIndex = -1;

        // Identify column indexes
        worksheet.getRow(2).eachCell((cell, colNumber) => {
            if (cell.value === searchColumn) {
                searchColumnIndex = colNumber;
            }
            if (cell.value === returnColumn) {
                returnColumnIndex = colNumber;
            }
        });

        if (searchColumnIndex === -1 || returnColumnIndex === -1) {
            console.error("Column not found.");
            return null;
        }

        // Iterate over rows to find the value
        for (let rowNumber = 3; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);
            const cellValue = row.getCell(searchColumnIndex).value;

            if (cellValue === searchValue) {
                return row.getCell(returnColumnIndex).value as string;
            }
        }

        console.error(`Value "${searchValue}" not found in column "${searchColumn}".`);
        return null;
    }
}

// Example Usage:
// (async () => {
//     const page: Page = {} as Page; // Mocking Playwright Page (Remove if using in Playwright context)
//     const excelUtil = new ExcelFunction(page);
    
//     const instructions = await excelUtil.readExcelValue(
//         "newSB.xlsx", 
//         "Step Title", 
//         "Note Patient's Height", 
//         "Instructions"
//     );

//     console.log(instructions);
// })();
