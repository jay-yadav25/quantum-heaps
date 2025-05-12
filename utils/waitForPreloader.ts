import { Locator, Page, expect } from "@playwright/test";

export async function waitForPreloaderToHide(page: Page) {
    await expect(page.locator(".preloader")).not.toBeVisible({ timeout: 60000 });
}