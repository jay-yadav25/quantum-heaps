import { expect, Locator, type Page } from '@playwright/test';

export class QuantumDemoRequestPage {
  readonly page: Page;
  // ── Navigation Locators 
  readonly getStartedButton: Locator;
  readonly closeDialogButton: Locator;
  readonly startFreeLink: Locator;
  // ── Form Field Locators 
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyNameInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  // ── Form Action Locators 
  readonly requestDemoButton: Locator;
  readonly dataConsentCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.getStartedButton  = page.getByRole('link', { name: 'Get Started' }).nth(1);
    this.closeDialogButton = page.getByLabel('Close dialog');
    this.startFreeLink     = page.getByRole('link', { name: 'Start Free · No Card Needed' });
    // Form fields
    this.firstNameInput    = page.getByPlaceholder('John');
    this.lastNameInput     = page.getByPlaceholder('Doe');
    this.companyNameInput  = page.getByPlaceholder('Company Name');
    this.mobileNumberInput = page.getByPlaceholder('Mobile Number');
    this.emailInput        = page.getByPlaceholder('Email');
    this.messageInput      = page.getByPlaceholder('Message');
    // Actions
    this.requestDemoButton   = page.getByRole('button', { name: 'Request Your Custom Demo' });
    this.dataConsentCheckbox = page.getByLabel('I agree to the collection and');
  }

  /** Navigate to the Quantum Heaps home page */
  async navigateToHomePage(): Promise<void> {
    await this.page.goto('https://quantumheaps.com/');
  }

  /** Click the second "Get Started" link in the nav/hero area */
  async clickGetStarted(): Promise<void> {
    await this.getStartedButton.click();
  }

  /** Close the modal/dialog that appears after clicking Get Started */
  async closeDialogPopup(): Promise<void> {
    await this.closeDialogButton.click();
  }

  /** Click "Start Free · No Card Needed" link to open the demo form */
  async clickStartFreeLink(): Promise<void> {
    await this.startFreeLink.click();
  }

  /**
   * Fill in all fields of the demo request form.
   */
  async fillDemoRequestForm(
    firstName: string,
    lastName: string,
    companyName: string,
    mobile: string,
    email: string,
    message: string
  ): Promise<void> {
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
    await this.firstNameInput.press('Tab');

    await this.lastNameInput.fill(lastName);
    await this.lastNameInput.press('Tab');

    await this.companyNameInput.fill(companyName);

    await this.mobileNumberInput.click();
    await this.mobileNumberInput.fill(mobile);

    await this.emailInput.click();
    await this.emailInput.fill(email);

    await this.messageInput.click();
    await this.messageInput.fill(message);
  }

  async clickRequestDemoButton(): Promise<void> {
    await this.requestDemoButton.click();
  }

  async acceptDataCollectionConsent(): Promise<void> {
    await this.dataConsentCheckbox.check();
  }

  async submitDemoRequest(): Promise<void> {
    //await this.requestDemoButton.click();
  }

  async verifySubmissionSuccess(): Promise<void> {
    // Wait for either a success message or URL change after submission
    await this.page.waitForLoadState('networkidle');
    const successMessage = this.page.locator('');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  }
}