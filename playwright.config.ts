import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
require('dotenv').config()

const testSuites = require('./testSuites.json');
const browserName: string = process.env.BROWSER || "chrome";
const testSuite = process.env.TEST_SUITE || 'ALL'
const isCI = process.env.CI === 'true';
const buildNo = process.env.BUILD_NUMBER || 'default'

function getBrowserSpecificOptions(browserName: string) {
  switch (browserName) {
    case "firefox":
      return {
        ...devices["Desktop Firefox"],
      };
    case "chrome":
    case "chromium":
      return {
        ...devices["Desktop Chrome"],
      };
    case "edge":
      return {
        channel: "msedge",
      };
    case "safari":
      return {
        channel: "webkit",
        ...devices["Desktop Safari"]
      }
  }
}

const testDir = defineBddConfig({
  paths: ['features/*.feature'],
  require: ['steps/**/*.ts'],
  importTestFrom: './steps/common/customTest.fixture.ts',
  tags: process.env.TAGS || testSuites[testSuite],
});

export default defineConfig({
  testDir,
  /* Maximum time spent by the feature test function, fixtures, beforeEach and afterEach hooks.
   * 30 seconds by default. Consider number of scenarios per feature to set the value. 
   * To override this value at feature level, use @timeout:<value>ms 
   */
  timeout: 50 * 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 60 * 1000,
  },
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 60 * 1000,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    headless: true,
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  // Limit the number of workers on CI, use default locally
  workers: "90%",
  /* Run tests(scenarios) in files(features) as well in parallel, 
   * By default only features run parallelly, Scenarios in a single feature run in order 
   */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left @only in the source code. */
  forbidOnly: isCI,
  retries: 0,
  reporter: [['line'], ['html'], ['allure-playwright', { outputFolder: 'allure-results' }], ['json', { outputFile: `allure-json/results_${buildNo}.json` }]],
  globalSetup: './fixtures/globalSetup',
  projects: [
    {
      name: 'Clinical Simulation',
      use: {
        ...getBrowserSpecificOptions(browserName),
      },
    },
  ],
});
