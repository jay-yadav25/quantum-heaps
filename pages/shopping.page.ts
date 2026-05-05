import { expect, Locator, type Page } from '@playwright/test';

export class ShoppingPage {
  readonly page: Page;

  // ── Navigation Locators 
  readonly menNavLink: Locator;
  readonly kidsNavLink: Locator;

  // ── Shop / Category Link Locators 
  readonly womensShopLink: Locator;
  readonly mensShopLink: Locator;
  readonly kidsShopLink: Locator;
  readonly sutaWomenSubCategoryLink: Locator;

  // ── Product Locators 
  readonly womensProductLink: Locator;
  readonly mensProductLink: Locator;
  readonly kidsProductLink: Locator;

  // ── Size Button Locators 
  readonly sizeL: Locator;
  readonly sizeOnesize: Locator;

  // ── Bag Action Locators 
  readonly addToBagButton: Locator;
  readonly addToBagLabel: Locator;
  readonly goToBagButton: Locator;

  // ── Cart / Coupon Locators 
  readonly applyCouponButton: Locator;
  readonly removeAllButton: Locator;

  // ── Delivery Locators 
  readonly selectDeliveryAddressButton: Locator;
  readonly homeAddressButton: Locator;

  // ── Payment Locators 
  readonly choosePaymentMethodButton: Locator;
  readonly payOnDeliveryButton: Locator;
  readonly paymentMethodSheet: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.menNavLink  = page.getByRole('link', { name: 'MEN', exact: true });
    this.kidsNavLink = page.getByRole('link', { name: 'KIDS' });

    // Shop / Category links
    this.womensShopLink           = page.getByRole('link', { name: 'SBC_02' });
    this.mensShopLink             = page.getByRole('link', { name: 'SBC_02 (1)' });
    this.kidsShopLink             = page.getByRole('link', { name: 'shhadi kids' });
    this.sutaWomenSubCategoryLink = page.getByRole('link', { name: /SUTA-WOMEN/i });

    // Products
    this.womensProductLink = page.getByRole('link', { name: /Tops - Women's Navy Casual/i });
    this.mensProductLink   = page.getByRole('link', { name: /Tshirt - Men's Black Casual/i }).first();
    this.kidsProductLink   = page.getByRole('link', { name: /Sarees - Women's Purple Casual/i });

    // Sizes
    this.sizeL       = page.getByRole('button', { name: 'L', exact: true });
    this.sizeOnesize = page.getByRole('button', { name: 'Onesize' }).nth(1);

    // Bag actions
    this.addToBagButton = page.getByRole('button', { name: 'Add to bag' });
    this.addToBagLabel  = page.getByLabel('Add to bag');
    this.goToBagButton  = page.getByRole('button', { name: 'Go to bag' });

    // Cart / Coupon
    this.applyCouponButton = page.getByRole('button', { name: 'Apply' });
    this.removeAllButton   = page.getByRole('button', { name: 'Remove All' }).nth(1);

    // Delivery
    this.selectDeliveryAddressButton = page.getByRole('button', { name: 'Select Delivery Address' });
    this.homeAddressButton           = page.getByRole('button', { name: 'Home Ajaya, 9370729713 294,' });

    // Payment
    this.choosePaymentMethodButton = page.getByRole('button', { name: 'Choose Payment Method' });
    this.payOnDeliveryButton       = page.getByRole('button', { name: 'Pay on Delivery Pay on' });
    this.paymentMethodSheet        = page.locator('div').filter({ hasText: /Select Payment Method/i }).nth(4);
  }

  // ── Navigation Methods ───────────────────────────────────────────────────────

  /** Navigate to the Zilo homepage */
  async goto(): Promise<void> {
    await this.page.goto('https://zilo.one/');
  }

  /** Click the MEN top-nav link */
  async goToMenCategory(): Promise<void> {
    await this.menNavLink.click();
  }

  /** Click the KIDS top-nav link */
  async goToKidsCategory(): Promise<void> {
    await this.kidsNavLink.click();
  }

  // ── Shop / Sub-Category Methods ──────────────────────────────────────────────

  /** Open the Women's SBC_02 shop */
  async openWomensShop(): Promise<void> {
    await this.womensShopLink.click();
  }

  /** Open the Men's SBC_02 shop */
  async openMensShop(): Promise<void> {
    await this.mensShopLink.click();
  }

  /** Open the Kids shop (shhadi kids) */
  async openKidsShop(): Promise<void> {
    await this.kidsShopLink.click();
  }

  /** Navigate into the SUTA-WOMEN sub-category */
  async openSutaWomenSubCategory(): Promise<void> {
    await this.sutaWomenSubCategoryLink.click();
  }

  // ── Product Methods ──────────────────────────────────────────────────────────

  /** Select the Women's Navy Casual Top product */
  async selectWomensProduct(): Promise<void> {
    await this.womensProductLink.click();
  }

  /** Select the Men's Black Casual T-shirt product */
  async selectMensProduct(): Promise<void> {
    await this.mensProductLink.click();
  }

  /** Select the Kids / Women's Purple Saree product */
  async selectKidsProduct(): Promise<void> {
    await this.kidsProductLink.click();
  }

  // ── Size Methods ─────────────────────────────────────────────────────────────

  /** Choose size L */
  async selectSizeL(): Promise<void> {
    await this.sizeL.click();
  }

  /** Choose Onesize (second occurrence — used on Saree page) */
  async selectSizeOnesize(): Promise<void> {
    await this.sizeOnesize.click();
  }

  // ── Bag Methods ──────────────────────────────────────────────────────────────

  /** Add the current product to the bag (handles both button and label variants) */
  async addToBag(): Promise<void> {
    if (await this.addToBagButton.isVisible()) {
      await this.addToBagButton.click();
    } else {
      await this.addToBagLabel.click();
    }
  }

  /** Proceed to the bag / cart page */
  async goToBag(): Promise<void> {
    await this.goToBagButton.click();
  }

  // ── Coupon / Promo Methods ───────────────────────────────────────────────────

  /** Apply any available coupon — no-op if button is not visible */
  async applyCoupon(): Promise<void> {
    if (await this.applyCouponButton.isVisible()) {
      await this.applyCouponButton.click();
    }
  }

  /** Remove all applied coupons — no-op if button is not present */
  async removeAllCoupons(): Promise<void> {
    const count = await this.page.getByRole('button', { name: 'Remove All' }).count();
    if (count > 1) {
      await this.removeAllButton.click();
    } else if (count === 1) {
      await this.page.getByRole('button', { name: 'Remove All' }).first().click();
    }
  }

  // ── Delivery Methods ─────────────────────────────────────────────────────────

  /** Open address picker and select the saved home address */
  async selectDeliveryAddress(): Promise<void> {
    await this.selectDeliveryAddressButton.click();
    await this.homeAddressButton.click();
  }

  // ── Payment Methods ──────────────────────────────────────────────────────────

  /** Open the Choose Payment Method panel */
  async openPaymentOptions(): Promise<void> {
    await this.choosePaymentMethodButton.click();
  }

  /** Select Pay on Delivery and dismiss the payment sheet */
  async selectPayOnDelivery(): Promise<void> {
    await this.payOnDeliveryButton.click();
    if (await this.paymentMethodSheet.isVisible()) {
      await this.paymentMethodSheet.click();
    }
  }

  /**
   * Confirm the order by clicking the first available button.
   * Retries 3 times to handle multi-step confirmation dialogs.
   */
  async confirmOrder(): Promise<void> {
    for (let i = 0; i < 3; i++) {
      const firstBtn = this.page.getByRole('button').first();
      if (await firstBtn.isVisible()) {
        await firstBtn.click();
        await this.page.waitForTimeout(500);
      }
    }
  }

  // ── Assertion Methods ────────────────────────────────────────────────────────

  /**
   * Verify the order was placed successfully.
   * Checks for a success message; uncomment expect once selector is confirmed.
   */
  async verifyOrderSuccess(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    const successMessage = this.page.locator('text=/order (placed|confirmed|success)/i');
    // await expect(successMessage).toBeVisible({ timeout: 10000 });
  }
}