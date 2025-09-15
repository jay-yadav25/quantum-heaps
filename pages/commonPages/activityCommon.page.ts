import { expect, Locator, FrameLocator, type Page } from '@playwright/test';
import { performAccessibilityScan } from '../../utils/accessibilityScan';

export class ActivityCommonPage {
    readonly page: Page;
    private readonly frameLocator: FrameLocator;

    // Learning Objectives Page
    readonly loader:Locator;
    readonly startButton:Locator;
    readonly introductionContinueButton:Locator;
    readonly continueButtonIntroAndLoPopup:Locator;
    readonly learningObjectiveTitle: Locator;
    readonly learningObjectiveDetails: Locator;
    readonly activityTitleStartPage: Locator;
      // Introduction Popup
    readonly introductionPageTitle: Locator;
    readonly introPopupText: Locator;
    readonly intrductionPopupContinueButton: Locator;
    readonly activityOverviewTitle: Locator;
    readonly activityOverviewDetails: Locator;

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
    readonly learningObjectiveTitleInPopup: Locator;
    readonly learningObjectiveDetailsInPopup: Locator;
    readonly learningObjectiveHeader: Locator;
    readonly learningObjectiveHeaderInPopup:Locator;
    readonly chatSectionInstructionList :Locator;
    readonly chatSectionConversationTitle:Locator;
    
    // Introduction Popup
   readonly introductionPopupTitle: Locator;
    readonly introPopupTextInPopup: Locator;
    readonly activityOverviewTitleInPopup: Locator;
    readonly activityOverviewDetailsInPopup: Locator;
    readonly introductionActivityMode:Locator;
    readonly introductionActivityModeInPopup:Locator;
 readonly moreOptionsButton:Locator;
    readonly moreOptionLearnignObjectiveButton:Locator;
    readonly moreOptionIntroductionButton:Locator;
    readonly popupContinueButton:Locator;

    constructor(page: Page, iframeName: string = 'ext_012345678_1') {
        this.page = page;
        this.frameLocator = page.frameLocator(`iframe[name="${iframeName}"]`);

        // Learning Objectives Page
        this.loader = this.frameLocator.locator('div.circular-loader');
    
        this.startButton = this.frameLocator.locator("//button[@id='start-btn']");
         this.introductionContinueButton = this.frameLocator.locator("button#introduction-continue-btn");
        this.intrductionPopupContinueButton = this.frameLocator.locator(".continue-button");
         this.continueButtonIntroAndLoPopup = this.frameLocator.locator("button#continue-btn").nth(1);
    

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
        this.chatSectionInstructionTitle = this.frameLocator.locator("h2.instruction-title");
        this.chatSectionConversationTitle = this.frameLocator.locator("#chat-title");
        
        this.chatSectionInstructionText = this.frameLocator.locator("div.instruction-content");
        this.chatSectionInstructionList = this.frameLocator.locator("ul.instruction-description li");
        
        this.chatTitle = this.frameLocator.locator("div#chat-title");
        this.scenarioCharacterName = this.frameLocator.locator("div.your-character-name");
        this.scenarioCharacterRole = this.frameLocator.locator("div.your-character-role");
        this.patientCharacterName = this.frameLocator.locator("strong.patient-character-name");
        this.patientCharacterRole = this.frameLocator.locator("div.patient-character-role");
        this.defaultChatOption = this.frameLocator.locator("#default_chat_option_1");
        this.defaultReplyOption = this.frameLocator.locator("span#default_reply_option_1");
        this.doneSubmitButton = this.frameLocator.locator("#chat-done-btn");
        this.submitButton = this.frameLocator.locator("#submit-btn");
        this.popupContinueButton = this.frameLocator.locator("//button[@id='continue-btn' and contains(@class, 'common-done-btn')]");
    

         // Learning Objectives Page
    this.learningObjectiveTitle = this.frameLocator.locator("h2.info-title");
    this.learningObjectiveTitleInPopup = this.frameLocator.locator(" h2#dialog_label");
    this.learningObjectiveDetails = this.frameLocator.locator(".ul-wrapper>ul li");
    this.learningObjectiveDetailsInPopup = this.frameLocator.locator("#dialog_desc>.ul-wrapper>ul li");
    this.activityTitleStartPage = this.frameLocator.locator("#start-page-title .start-page-title-container");
    this.learningObjectiveHeader = this.frameLocator.locator("div.info-subtitle");
    this.learningObjectiveHeaderInPopup = this.frameLocator.locator("#dialog_desc>p.sub-title");
  
    this.introductionPageTitle = this.frameLocator.locator("#introduction_label");
    this.introductionPopupTitle = this.frameLocator.locator("h2#dialog_label");
    this.introPopupText = this.frameLocator.locator("#introduction_desc span");
    this.introPopupTextInPopup = this.frameLocator.locator("#dialog_desc>div.popup-details>p");
    this.activityOverviewTitle = this.frameLocator.locator("h3.overview-title");
    this.activityOverviewTitleInPopup = this.frameLocator.locator("#dialog_desc h3.overview-title");
    this.activityOverviewDetails = this.frameLocator.locator("ul.overview-text  li");
    this.activityOverviewDetailsInPopup = this.frameLocator.locator(" #dialog_desc ul.overview-text  li");
    this.introductionActivityMode = this.frameLocator.locator(".challenge-mode-text>p");
    this.introductionActivityModeInPopup = this.frameLocator.locator(" #dialog_desc .challenge-mode-text>p");
    this.moreOptionsButton = this.frameLocator.locator('//button[@aria-label="More Options"]');
    this.moreOptionLearnignObjectiveButton = this.frameLocator.locator('//li[@aria-label="Learning Objectives"]');
    this.moreOptionIntroductionButton = this.frameLocator.locator('//li[@aria-label="Introduction"]');
    }


public async launchActivity(environment:string,activityNo: number) {
    console.log(environment);
  let baseUrl='';
  if(environment==="PROD"){
    baseUrl="https://cengage-dho.zeuslearning.com/index.html";
  }else if (environment==="STAGE"){
    baseUrl="https://dev-cengage-dho.zeuslearning.com/launcherPages/cengage_dho_launcher.html";
  }
  const activityMap: Record<number, string> = {
    1: "cs_c_01",
    2: "cs_l_02",
    3: "dm_l_03",
    4: "dm_c_04",
    5: "cs_c_05",
    6: "dm_l_06",
  };

  const dhoCode = activityMap[activityNo];
    const url = `${baseUrl}?launchType=1&dho=${dhoCode}&attemptId=1`;
    await this.page.goto(url);
    const timeout = 4 * 60 * 1000; // 4 minutes
    const interval = 2000; // 2 seconds
    const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      // Check if loader is visible
      if (await this.loader.isVisible()) {
        await this.page.waitForTimeout(interval);
        continue;
      }
      if (await this.startButton.isVisible() && await this.startButton.isEnabled()) {
        return;
      }

    } catch (err) {
    }
    await this.page.waitForTimeout(interval);
  }
  throw new Error("Loader did not disappear or button not clickable within 4 minutes");
  }
public async clickOnIntroductionContinueButton() {
await this.introductionContinueButton.click();
}
public async clickOnStartButton() {
await this.startButton.click();
}

    public async verifyFirstStepIsVisible() {
    
  }
    public async clickOnPopupContinueButton() {
    await this.popupContinueButton.nth(1).click();
  }
     public async clickOnMoreOptionPopupIntroductionButton() {
    await this.clickOnPopupContinueButton();
    await this.moreOptionsButton.click();
    await this.moreOptionIntroductionButton.click();
    }
    public async clickOnMoreOptionPopupLearningObjectiveButton() {
        await this.moreOptionsButton.click();
        await this.moreOptionLearnignObjectiveButton.click();
    }

   // Started
    public async verifyLearningObjectivePageIsVisible() {
        await expect(this.activityTitleStartPage).toBeVisible();
    }
    //All Activity LO page
    public async verifyTitleAndLearningObjectivesPage(testData: any, testInfo: any) {
        const activityTitle = testData.activityTitle;
        const learningObjectiveHeader = testData.learningObjectiveItems.learningObjective;
        const learningObjectivesList = testData.learningObjectiveItems.learningObjectivesList;

        // Check visibility and content
        await expect(this.activityTitleStartPage).toHaveText(activityTitle);
        await expect(this.learningObjectiveTitle).toBeVisible();
        await expect(this.learningObjectiveTitle).toHaveText("Learning Objectives");
        await expect(this.learningObjectiveHeader).toHaveText(learningObjectiveHeader);

        const objectiveItems = await this.learningObjectiveDetails.all();
        expect(objectiveItems.length).toBe(learningObjectivesList.length);

        for (let i = 0; i < objectiveItems.length; i++) {
        await expect(objectiveItems[i]).toHaveText(learningObjectivesList[i]);
        }
    
    }
    //All Activity Lo Popup
    public async verifyLearningObjectivesPopUp(testData:any) {
        const learningObjectiveHeader=testData.learningObjectiveItems.learningObjective;
        const learningObjectivesList=testData.learningObjectiveItems.learningObjectivesList;
        await expect(this.learningObjectiveTitleInPopup).toBeVisible();
        await expect(this.learningObjectiveTitleInPopup).toHaveText("Learning Objectives");
        await expect(this.learningObjectiveHeaderInPopup).toHaveText(learningObjectiveHeader);
        const objectiveItems = await this.learningObjectiveDetailsInPopup.all();
        expect(objectiveItems.length).toBe(learningObjectivesList.length);
        for (let i = 0; i < objectiveItems.length; i++) {
            await expect(objectiveItems[i]).toHaveText(learningObjectivesList[i]);
        }
        await this.continueButtonIntroAndLoPopup.click();
    }
    public async verifyIntroductionPageIsVisible() {
       await expect(this.introductionPageTitle).toBeVisible();
    }
  public async verifyIntroductionPage(testData:any) {
    const introductionList=testData.introduction.introductionList;
    const activityOverviewList=testData.introduction.activityOverviewList;
    const mode=testData.introduction.mode;
    await expect(this.introductionPageTitle).toHaveText("Introduction");
    const introductionsListLocator = await this.introPopupText.all();
    expect(introductionsListLocator.length).toBe(introductionList.length);
    for (let i = 0; i < introductionList.length; i++) {
        await expect(introductionsListLocator[i]).toHaveText(introductionList[i]);
    }
      await expect(this.activityOverviewTitle).toHaveText("Activity Overview");
    const activityOverviewLocator = await this.activityOverviewDetails.all();
    expect(activityOverviewLocator.length).toBe(activityOverviewList.length);
    for (let i = 0; i < activityOverviewList.length; i++) {
        await expect(activityOverviewLocator[i]).toHaveText(activityOverviewList[i]);
    }
    await expect(this.introductionActivityMode).toHaveText(mode);
  }
  public async verifyIntroductionPopUp(testData:any) {
    const introductionList=testData.introduction.introductionList;
    const activityOverviewList=testData.introduction.activityOverviewList;
    const mode=testData.introduction.mode;
    await expect(this.introductionPopupTitle).toBeVisible();
    await expect(this.introductionPopupTitle).toHaveText("Introduction");
    const introductionsListLocator = await this.introPopupText.all();
    expect(introductionsListLocator.length).toBe(introductionList.length);
    for (let i = 0; i < introductionList.length; i++) {
        await expect(introductionsListLocator[i]).toHaveText(introductionList[i]);
    }
      await expect(this.activityOverviewTitleInPopup).toHaveText("Activity Overview");
    const activityOverviewLocator = await this.activityOverviewDetailsInPopup.all();
    expect(activityOverviewLocator.length).toBe(activityOverviewList.length);
    for (let i = 0; i < activityOverviewList.length; i++) {
        await expect(activityOverviewLocator[i]).toHaveText(activityOverviewList[i]);
    }
    await expect(this.introductionActivityModeInPopup).toHaveText(mode);
    
  }

public async clickOnContinueButtonIntroAndLoPopup() {
        await this.continueButtonIntroAndLoPopup.click();
    }

    public async clickOnintrductionPopupContinueButton() {
        await this.intrductionPopupContinueButton.click();
    }

    /**
     * Verify the avatar selection page is displayed
     */
    public async verifyAvatarSelectionPage(testData:any) {
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
        await expect(this.chatSectionActivityTitle).toHaveText(testData.activityTitle);

        await expect(this.chatSectionConversationTitle).toBeVisible();
        await expect(this.chatSectionConversationTitle).toHaveText(testData.conversationPage.conversatinTitle);

        await expect(this.chatSectionInstructionTitle).toBeVisible();
        await expect(this.chatSectionInstructionTitle).toHaveText("Instructions");

        const chatSectionInstructionTextLocator = await this.chatSectionInstructionText.all();
        for (let i = 0; i < testData.instruction.instructionsList.length; i++) {
            await expect(chatSectionInstructionTextLocator[i]).toHaveText(testData.instruction.instructionsList[i]);
        }

        // await expect(this.scenarioCharacterName).toBeVisible();
        // await expect(this.scenarioCharacterName).toHaveText(testData.characterName);

        // await expect(this.scenarioCharacterRole).toBeVisible();
        // await expect(this.scenarioCharacterRole).toHaveText(testData.characterRole);

        // await expect(this.patientCharacterName).toBeVisible();
        // await expect(this.patientCharacterName).toHaveText(testData.patientName);

        // await expect(this.patientCharacterRole).toBeVisible();
        // await expect(this.patientCharacterRole).toHaveText(testData.patientRole);
        await expect(this.defaultChatOption).toHaveText(testData.defaultChat.Jay);
        await expect(this.defaultReplyOption).toHaveText(testData.defaultChat.Emily);
    
    }
    //Accessiblity scan common function
    public async performAccessivityScanForGivenPage(testInfo:any,pageName:string){
       await performAccessibilityScan({
        page: this.page,
        testInfo,
        scanType: 'iframe',
        attachmentName: `${pageName}-Accessibility`
      })
  }
}