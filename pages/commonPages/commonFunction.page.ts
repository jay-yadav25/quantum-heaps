import { expect, type Locator, type Page } from '@playwright/test';

export class CommonFunction {
    readonly page: Page;
    readonly stepIntroductionContinueButton: Locator;
    readonly iframeLocator: Locator;
    readonly ehrButton: Locator;
    readonly closeButton: Locator;
    readonly doneButton: Locator;
    readonly popupFeedbackText: Locator;
    readonly attemptsRemaining: Locator;
    readonly goToNextStepButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.iframeLocator = page.locator("iframe[name='ext_012345678_1']");
        const frameLocator = this.iframeLocator.contentFrame();
        this.stepIntroductionContinueButton = frameLocator.getByRole('button', { name: 'Continue' });
        this.ehrButton = frameLocator.locator("//div[@class='ehr-icon']");
        this.closeButton = frameLocator.getByRole('button', { name: 'Close' }).first();
        this.goToNextStepButton = frameLocator.locator("(//div[@class='button-text-wrapper'][normalize-space()='Continue'])[1]")
        this.popupFeedbackText = frameLocator.locator("//p[@id='feedbackDescription']");
        this.attemptsRemaining = frameLocator.locator("//span[@id='attemptsRemaining']");
        this.doneButton = frameLocator.getByRole('button', { name: 'Done' });
    }

    public async clickOnContonueButton() {
        await this.stepIntroductionContinueButton.click();
    }

    public async openEHRFrom() {
        await this.ehrButton.click();
    }

    public async closeEHRFrom() {
        await this.closeButton.click();
    }

    public async clickOnDoneButton() {
        await this.doneButton.click();
    }

    public async clickOnFeedbackCloseButton() {
        await this.closeButton.click();
    }

    public async verifyPopupFeedbackText(feedbackText: string) {
        await expect(this.popupFeedbackText).toHaveText(feedbackText);
    }

    public async verifyNoOfAttempts(noOFAttempts: string) {
        await expect(this.attemptsRemaining).toHaveText(noOFAttempts);
    }

    public async clickOnGoTONextStepContinueButton() {
        await this.goToNextStepButton.click();
    }

    public async selectOneOptionRandomlyFromList(
        OptionName: any, // Accept any type
        feedbackText1: string,
        feedbackText2: string,
        feedbackText3: string,
    ) {
        console.log(OptionName);
        // Check if OptionName is iterable (array or string)
        if (!Array.isArray(OptionName) && typeof OptionName !== 'string') {
            throw new TypeError("OptionName must be an array or a string");
        }

        let optionsRemaining = [...OptionName];
        const maxAttempts = Math.min(3, optionsRemaining.length);

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const randomIndex = Math.floor(Math.random() * optionsRemaining.length);
            const buttonName = optionsRemaining[randomIndex];
            console.log(buttonName);

            optionsRemaining = optionsRemaining.filter((value) => value !== buttonName);

            const frameLocator = this.iframeLocator.contentFrame();
            const instrumentButton: Locator = frameLocator.locator(
                `//button[@aria-label='${buttonName}' and (not(@aria-hidden) or @aria-hidden='false') and not(@disabled)]`
            ).first();
            await instrumentButton.isEnabled()
            await instrumentButton.click();

            if (attempt === 0) {
                await expect(this.popupFeedbackText).toHaveText(feedbackText1);
                await expect(this.attemptsRemaining).toHaveText("2 Attempts Remaining");
            } else if (attempt === 1) {
                await expect(this.popupFeedbackText).toHaveText(feedbackText2);
                await expect(this.attemptsRemaining).toHaveText("1 Attempt Remaining");
            } else if (attempt === 2) {
                await expect(this.popupFeedbackText).toHaveText(feedbackText3);
            }

            await this.clickOnFeedbackCloseButton();

        }
        await this.page.waitForTimeout(5000);
    }


    public async selectInstruments(instrumentName: string[]) {

        //   await this.gauzeButton.click();

        //   // Sharps Container
        //   await this.sharpsContainerButton.click();
        //   await this.page.waitForTimeout(6000);

        //   // Done
        //   await this.doneButton.click();
        //   await this.page.waitForTimeout(6000);
        //   await this.closeButton.click();

        //   // Cleansing Towelettes
        //   await this.cleansingTowelettesButton.click();
        //   await this.page.waitForTimeout(6000);
        //   await this.doneButton.click();
        //   await this.closeButton.click();

        //   // Final Done and Next Step
        //   await this.doneButton.click();
        //   await this.page.waitForTimeout(6000);
        //   await this.goToNextStepButton.click();

        //   // Tip of the ring finger
        //   await this.page.waitForTimeout(6000);
        //   await this.tipOfRingFingerButton.click();
        //   await this.closeButton.click();

        //   // Go to next step again
        //   await this.goToNextStepButton.click();
    }


    // public async verifyDeleteDistrictDialogBoxText(districtName: string, text: string) {
    //   await this.dialogBoxText.isVisible();
    //   await expect(this.dialogBoxText).toHaveText(text);

    // }

}