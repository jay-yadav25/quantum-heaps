import { Page } from "@playwright/test";

export class ChatInteraction {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async selectAndVerifyResponse(
        idealPath: string,
        distractorPath: string,
        incorrectPath: string,
        optionToSelect: "ideal" | "distractor" | "incorrect",
        replyText: string
    ) {
        // Verify if all options are visible
        await this.page.locator(`text=${idealPath}`).waitFor();
        await this.page.locator(`text=${distractorPath}`).waitFor();
        await this.page.locator(`text=${incorrectPath}`).waitFor();

        // Select the option based on argument
        let selectedOptionLocator;
        switch (optionToSelect) {
            case "ideal":
                selectedOptionLocator = this.page.locator(`text=${idealPath}`);
                break;
            case "distractor":
                selectedOptionLocator = this.page.locator(`text=${distractorPath}`);
                break;
            case "incorrect":
                selectedOptionLocator = this.page.locator(`text=${incorrectPath}`);
                break;
            default:
                throw new Error("Invalid option selected");
        }

        // Click the selected option
        await selectedOptionLocator.click();

        // Dummy locator for chat section
        const chatSectionLocator = this.page.locator("#chat-section"); // Replace with actual locator

        // Verify the selected option appears in the chat section
        await chatSectionLocator.locator(`text=${optionToSelect === "ideal" ? idealPath : optionToSelect === "distractor" ? distractorPath : incorrectPath}`).waitFor();

        // Verify the reply text appears below the selected option
        await chatSectionLocator.locator(`text=${replyText}`).waitFor();
    }
}


// test("Verify chat selection and response", async ({ page }) => {
//     const chatInteraction = new ChatInteraction(page);

//     await page.goto("https://your-testing-website.com"); // Update with actual URL

//     await chatInteraction.selectAndVerifyResponse(
//         "Ideal Option Text",
//         "Distractor Option Text",
//         "Incorrect Option Text",
//         "ideal", // Choose "ideal", "distractor", or "incorrect"
//         "Expected Reply Text"
//     );
// });
