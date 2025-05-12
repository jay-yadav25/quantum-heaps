import { Page, Locator } from '@playwright/test';

export async function waitForElementToBeVisible(locator: Locator, timeout: number) {
    try {
        await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
        throw new Error(`Element not visible within ${timeout} ms: ${error.message}`);
    }
}
