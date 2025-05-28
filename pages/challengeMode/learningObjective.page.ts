import { expect, Locator, FrameLocator, type Page } from '@playwright/test';

export class LearningObjectivePage {
    readonly page: Page;
    private readonly frameLocator: FrameLocator;

    // Learning Objectives Page
    readonly learningObjectiveTitle: Locator;
    readonly learningObjectiveDetails: Locator;
    readonly activityTitleStartPage: Locator;
    readonly startButton: Locator;

    // Introduction Popup
    readonly introductionPopUpTitle: Locator;
    readonly introPopupText: Locator;
    readonly intrductionPopupContinueButton: Locator;

    // Avatar Selection Page
    readonly avatarSelectionContainer: Locator;
    readonly inputField: Locator;
    readonly avatarSelectionDoneButton: Locator;
    readonly avatarFemale: Locator;
    readonly avatarMale: Locator;
    readonly optionButton: Locator;

    // Menu Popup
    readonly learningObjectiveButton: Locator;
    readonly introductionButton: Locator;
    readonly avatarButton: Locator;

    // Chat Section
    readonly chatSectionActivityTitle: Locator;
    readonly chatSectionInstructionTitle: Locator;
    readonly chatSectionInstructionText: Locator;
    readonly chatTitle: Locator;
    readonly scenarioCharacterName: Locator;
    readonly scenarioCharacterRole: Locator;
    readonly patientCharacterName: Locator;
    readonly patientCharacterRole: Locator;
    readonly defaultChatOption: Locator;
    readonly defaultReplyOption: Locator;
    readonly doneSubmitButton: Locator;
    readonly submitButton: Locator;
    readonly retryButton: Locator;
    readonly chatEndMessage: Locator;
    readonly feedbackPopupText1: Locator;
    readonly feedbackPopupText2: Locator;

    constructor(page: Page, iframeName: string = 'ext_012345678_1') {
        this.page = page;
        this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);

        // Learning Objectives Page
        this.learningObjectiveTitle = this.frameLocator.locator("div.info-title");
        this.learningObjectiveDetails = this.frameLocator.locator("ul.info-details li");
        this.activityTitleStartPage = this.frameLocator.locator("#start-page-title");
        this.startButton = this.frameLocator.locator("#start-btn");

        // Introduction Popup
        this.introductionPopUpTitle = this.frameLocator.locator("h2.popup-title");
        this.introPopupText = this.frameLocator.locator("div.popup-details");
        this.intrductionPopupContinueButton = this.frameLocator.locator(".continue-button");

        // Avatar Selection Page
        this.avatarSelectionContainer = this.frameLocator.locator("#avatar-selector-container");
        this.inputField = this.frameLocator.locator("//input[@class='input']");
        this.avatarSelectionDoneButton = this.frameLocator.locator("#avatar-done-btn");
        this.avatarFemale = this.frameLocator.locator("#avatar-avatar_1_female");
        this.avatarMale = this.frameLocator.locator("#avatar-avatar_3_male");
        this.optionButton = this.frameLocator.locator('button.nav-menu-close');

        // Menu Popup
        this.learningObjectiveButton = this.frameLocator.locator("#menu_item_1");
        this.introductionButton = this.frameLocator.locator("#menu_item_2");
        this.avatarButton = this.frameLocator.locator("#menu_item_3");

        // Chat Section
        this.chatSectionActivityTitle = this.frameLocator.locator("h1.navbar-title");
        this.chatSectionInstructionTitle = this.frameLocator.locator("div.instruction-title");
        this.chatSectionInstructionText = this.frameLocator.locator("div.instruction-content");
        this.chatTitle = this.frameLocator.locator("div#chat-title");
        this.scenarioCharacterName = this.frameLocator.locator("div.your-character-name");
        this.scenarioCharacterRole = this.frameLocator.locator("div.your-character-role");
        this.patientCharacterName = this.frameLocator.locator("div.patient-character-name");
        this.patientCharacterRole = this.frameLocator.locator("div.patient-character-role");
        this.defaultChatOption = this.frameLocator.locator("#default_chat_option_1");
        this.defaultReplyOption = this.frameLocator.locator("#default_reply_option_1");
        this.doneSubmitButton = this.frameLocator.locator("#chat-done-btn");
        this.submitButton = this.frameLocator.locator("#submit-btn");
        this.retryButton = this.frameLocator.locator("#retry-btn");
        this.chatEndMessage = this.frameLocator.locator("div.chat-ended-msg");
        this.feedbackPopupText1 = this.frameLocator.locator("div.popup-content p:nth-child(1)");
        this.feedbackPopupText2 = this.frameLocator.locator("div.popup-content p:nth-child(2)");
    }

    /**
     * Launch the learning activity
     */
    public async launchActivity() {
        await this.page.goto("https://dev-cengage-dho.zeuslearning.com/launcherpages/cengage_dho_launcher.html?dho=dho1&attemptId=1&lang=en");
    }

    /**
     * Verify the learning objectives page content
     * @param expectedActivityTitle - The expected activity title
     * @param expectedObjectiveTitle - The expected learning objective title
     * @param expectedObjectives - Array of expected learning objectives
     */
    public async verifyLearningObjectivesPageIsDisplayed(testData: any) {
        await expect(this.activityTitleStartPage).toBeVisible();
    }
    public async verifyLearningObjectivess(testData: any) {
        await expect(this.activityTitleStartPage).toHaveText(testData.activityTitle);

        await expect(this.learningObjectiveTitle).toBeVisible();
        await expect(this.learningObjectiveTitle).toHaveText(testData.learningObjectiveTitle);

        const objectiveItems = await this.learningObjectiveDetails.all();
        expect(objectiveItems.length).toBe(testData.learningObjectives.length);

        for (let i = 0; i < objectiveItems.length; i++) {
            await expect(objectiveItems[i]).toHaveText(testData.learningObjectives[i]);
        }
    }

    /**
     * Click the Start button on learning objectives page
     */
    public async clickOnLearningObjectivePageStartButton() {
        await this.startButton.click();
    }

    /**
     * Verify the introduction popup content
     */
    public async verifyIntroductionPopup(testData: any) {
        await expect(this.introductionPopUpTitle).toBeVisible();
        await expect(this.introductionPopUpTitle).toHaveText(testData.introductionTitle);
        await expect(this.introPopupText).toBeVisible();
        await expect(this.introPopupText).toHaveText(testData.introductionText);
    }

    /**
     * Click the Continue button on introduction popup
     */
    public async clickOnintrductionPopupContinueButton() {
        await this.intrductionPopupContinueButton.click();
    }

    /**
     * Verify the avatar selection page is displayed
     */
    public async verifyAvatarSelectionPage() {
        await expect(this.avatarSelectionContainer).toBeVisible();
        await expect(this.avatarFemale).toBeVisible();
        await expect(this.avatarMale).toBeVisible();
        await expect(this.inputField).toBeVisible();
        await expect(this.avatarSelectionDoneButton).toBeDisabled();
    }

    /**
     * Click the option button on avatar selection page
     */
    public async clickOptionButton() {
        await this.optionButton.click();
    }

    /**
     * Verify the menu popup content
     */
    public async verifyMenuPopup() {
        await expect(this.learningObjectiveButton).toBeVisible();
        await expect(this.introductionButton).toBeVisible();
        await expect(this.avatarButton).toBeVisible();
    }
    public async verifyAvatarButtonDisableOnAvatarPage() {
        await expect(this.avatarButton).toBeDisabled();
    }
    /**
     * Enter name in the input field
     */
    public async enterName(name: string) {
        await this.inputField.fill(name);
    }

    /**
     * Verify the done button is enabled after entering a name
     */
    public async verifyDoneButtonEnabled() {
        await expect(this.avatarSelectionDoneButton).toBeEnabled();
    }

    /**
     * Click on a specific avatar
     */
    public async selectAvatar(isFemale: boolean = true) {
        if (isFemale) {
            await this.avatarFemale.click();
        } else {
            await this.avatarMale.click();
        }
    }

    /**
     * Click the done button on avatar selection page
     */
    public async clickAvatarDoneButton() {
        await this.avatarSelectionDoneButton.click();
    }

    /**
     * Verify the chat section is displayed and has the correct content
     */
    public async verifyChatSection(testData: any) {
        await expect(this.chatSectionActivityTitle).toBeVisible();
        await expect(this.chatSectionActivityTitle).toHaveText(testData.chatSectionTitle);

        await expect(this.chatSectionInstructionTitle).toBeVisible();
        await expect(this.chatSectionInstructionTitle).toHaveText(testData.instructionTitle);

        await expect(this.chatSectionInstructionText).toBeVisible();
        await expect(this.chatSectionInstructionText).toHaveText(testData.instructionText);

        await expect(this.scenarioCharacterName).toBeVisible();
        await expect(this.scenarioCharacterName).toHaveText(testData.characterName);

        await expect(this.scenarioCharacterRole).toBeVisible();
        await expect(this.scenarioCharacterRole).toHaveText(testData.characterRole);

        await expect(this.patientCharacterName).toBeVisible();
        await expect(this.patientCharacterName).toHaveText(testData.patientName);

        await expect(this.patientCharacterRole).toBeVisible();
        await expect(this.patientCharacterRole).toHaveText(testData.patientRole);
    }
}