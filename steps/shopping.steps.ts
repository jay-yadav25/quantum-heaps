import path from 'path';
import fs from 'fs';
import { createBddCustom } from './common/createBddCustom';
import { ShoppingPage } from '../pages/shopping.page';

const { Given, When, Then, Before } = createBddCustom();

let shoppingPage: ShoppingPage;

Before({}, async ({ page, context }) => {
  const authPath = path.resolve('auth.json');

  if (!fs.existsSync(authPath)) {
    throw new Error(
      'auth.json not found. Run saveSession.ts first:\n' +
        'npx playwright test tests/auth/saveSession.ts --headed'
    );
  }

  const storageState = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
  await context.addCookies(storageState.cookies ?? []);

  if (storageState.origins?.length) {
    await context.addInitScript((origins) => {
      for (const { origin, localStorage } of origins) {
        if (location.origin === origin) {
          for (const { name, value } of localStorage) {
            window.localStorage.setItem(name, value);
          }
        }
      }
    }, storageState.origins);
  }

  shoppingPage = new ShoppingPage(page);
});

Given('User navigates to the Zilo homepage', async function ({}) {
  await shoppingPage.goto();
});
 
Given('User navigates to the Men category', async function ({}) {
  await shoppingPage.goToMenCategory();
});
 
Given('User navigates to the Kids category', async function ({}) {
  await shoppingPage.goToKidsCategory();
});

When('User opens the Womens shop', async function ({}) {
  await shoppingPage.openWomensShop();
});
 
When('User opens the Mens shop', async function ({}) {
  await shoppingPage.openMensShop();
});
 
When('User opens the Kids shop', async function ({}) {
  await shoppingPage.openKidsShop();
});
 
  
When('User selects the Womens product', async function ({}) {
  await shoppingPage.selectWomensProduct();
});
 
When('User selects the Mens product', async function ({}) {
  await shoppingPage.selectMensProduct();
});
 
When('User selects the Kids product', async function ({}) {
  await shoppingPage.selectKidsProduct();
});
 

When('User selects size for {string}', async function ({testData}, category: string) {
    await shoppingPage.selectSizeL(testData.categories[category]["size"]);
});
 
When('User adds the item to the bag', async function ({}) {
  await shoppingPage.addToBag();
});
 
When(
  'User adds the item to the bag {string} times',
  async function ({ testData }, category: string) {
    const categoryData = testData.categories[category];
 
    if (!categoryData) {
      throw new Error(
        `No test data found for category: "${category}". ` +
          `Please add an entry to testData.json under "categories".`
      );
    }
 
    const addCount: number = categoryData.addToBagCount ?? 1;
    for (let i = 0; i < addCount; i++) {
      if (i > 0) {
        //await shoppingPage.selectSizeL();
      }
      await shoppingPage.addToBag();
    }
  }
);
 
When('User goes to the bag', async function ({}) {
  await shoppingPage.goToBag();
});
 
When('User applies any available coupon', async function ({}) {
  await shoppingPage.applyCoupon();
});
 
When('User removes all applied coupons', async function ({}) {
  await shoppingPage.removeAllCoupons();
});
 
When('User selects the delivery address', async function ({}) {
  await shoppingPage.selectDeliveryAddress();
});
 
Then('User completes checkout and order is placed', async function ({}) {
  await shoppingPage.openPaymentOptions();
  await shoppingPage.selectPayOnDelivery();
  await shoppingPage.confirmOrder();
  await shoppingPage.verifyOrderSuccess();
});