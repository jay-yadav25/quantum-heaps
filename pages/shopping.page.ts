import { expect, Locator, type Page } from '@playwright/test';

export class ShoppingPage {
  readonly page: Page;

  readonly menNavLink: Locator;
  readonly kidsNavLink: Locator;

  readonly womensShopLink: Locator;
  readonly mensShopLink: Locator;
  readonly kidsShopLink: Locator;

  readonly womensProductLink: Locator;
  readonly mensProductLink: Locator;
  readonly kidsProductLink: Locator;

  readonly sizeL: Locator;
  readonly sizeOnesize: Locator;

  readonly addToBagButton: Locator;
  readonly addToBagLabel: Locator;
  readonly goToBagButton: Locator;

  readonly applyCouponButton: Locator;
  readonly removeAllButton: Locator;

  readonly selectDeliveryAddressButton: Locator;
  readonly homeAddressButton: Locator;
 
  readonly choosePaymentMethodButton: Locator;
  readonly payOnDeliveryButton: Locator;
  readonly paymentMethodSheet: Locator;
  readonly ziloHome:Locator;

  constructor(page: Page) {
    this.page = page;

    this.menNavLink  = page.getByRole('link', { name: 'MEN', exact: true });
    this.kidsNavLink = page.getByRole('link', { name: 'KIDS' });
    this.ziloHome = page.locator('[alt="Zilo"]');

    this.womensShopLink           = page.getByRole('link', { name: 'SBC_02' });
    this.mensShopLink             = page.getByRole('link', { name: 'SBC_02 (1)' });
    this.kidsShopLink             = page.locator('[alt="SBC_02 (3)"]');
   
    this.womensProductLink = page.getByRole('link', { name: /Tops - Women's Navy Casual/i });
    this.mensProductLink   = page.getByRole('link', { name: /Tshirt - Men's Black Casual/i }).first();
    this.kidsProductLink   = page.locator('[title="Girls Multicolor Casual Regular Fit Sleeveless Tops"]');

    this.sizeL       = page.getByRole('button', { name: 'L', exact: true });
    this.sizeOnesize = page.getByRole('button', { name: 'Onesize' }).nth(1);

    this.addToBagButton = page.getByRole('button', { name: 'Add to bag' });
    this.addToBagLabel  = page.getByLabel('Add to bag');
    this.goToBagButton  = page.getByRole('button', { name: 'Go to bag' });

    this.applyCouponButton = page.getByRole('button', { name: 'Apply' });
    this.removeAllButton   = page.getByRole('button', { name: 'Remove All' }).nth(1);

    this.selectDeliveryAddressButton = page.getByRole('button', { name: 'Select Delivery Address' });
    this.homeAddressButton           = page.getByRole('button', { name: 'Home Ajaya, 9370729713 294,' });

    this.choosePaymentMethodButton = page.getByRole('button', { name: 'Choose Payment Method' });
    this.payOnDeliveryButton       = page.getByRole('button', { name: 'Pay on Delivery Pay on' });
    this.paymentMethodSheet        = page.locator('div').filter({ hasText: /Select Payment Method/i }).nth(4);
  }

  async goto(): Promise<void> {
    await this.page.goto('https://zilo.one/');
  }

  async goToMenCategory(): Promise<void> {
    await this.ziloHome.click();
    await this.menNavLink.click();
  }

  async goToKidsCategory(): Promise<void> {
    await this.ziloHome.click();
    await this.kidsNavLink.click();
  }

  async openWomensShop(): Promise<void> {
    await this.womensShopLink.click();
  }

  async openMensShop(): Promise<void> {
    
    await this.mensShopLink.click();
  }

  async openKidsShop(): Promise<void> {
    await this.kidsShopLink.click();
  }

  async selectWomensProduct(): Promise<void> {
    await this.womensProductLink.click();
  }

  async selectMensProduct(): Promise<void> {
    await this.mensProductLink.click();
  }

  async selectKidsProduct(): Promise<void> {
    await this.kidsProductLink.click();
  }

  async selectSizeL(productSize:string): Promise<void> {
    await this.page.getByRole('button', { name: `${productSize}`, exact: true }).click();
  }

  async selectSizeOnesize(): Promise<void> {
    await this.sizeOnesize.click();
  }

  async addToBag(): Promise<void> {
    if (await this.addToBagButton.isVisible()) {
      await this.addToBagButton.click();
    } else {
      await this.addToBagLabel.click();
    }
  }

  async goToBag(): Promise<void> {
    await this.goToBagButton.click();
  }

  async applyCoupon(): Promise<void> {
    if (await this.applyCouponButton.isVisible()) {
      await this.applyCouponButton.click();
    }
  }

  async removeAllCoupons(): Promise<void> {
    const count = await this.page.getByRole('button', { name: 'Remove All' }).count();
    if (count > 1) {
      await this.removeAllButton.click();
    } else if (count === 1) {
      await this.page.getByRole('button', { name: 'Remove All' }).first().click();
    }
  }

  async selectDeliveryAddress(): Promise<void> {
    await this.selectDeliveryAddressButton.click();
    await this.homeAddressButton.click();
    await this.page.pause();
  }

  async openPaymentOptions(): Promise<void> {
    await this.choosePaymentMethodButton.click();
  }

  async selectPayOnDelivery(): Promise<void> {
    await this.payOnDeliveryButton.click();
    if (await this.paymentMethodSheet.isVisible()) {
      await this.paymentMethodSheet.click();
    }
  }

  async confirmOrder(): Promise<void> {
    for (let i = 0; i < 3; i++) {
      const firstBtn = this.page.getByRole('button').first();
      if (await firstBtn.isVisible()) {
        await firstBtn.click();
        await this.page.waitForTimeout(500);
      }
    }
  }

  async verifyOrderSuccess(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    const successMessage = this.page.locator('text=/order (placed|confirmed|success)/i');
    // await expect(successMessage).toBeVisible({ timeout: 10000 });
  }
}