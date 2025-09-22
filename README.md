# Project structure

| Folder name            | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| features\*             | Contains gherkin syntax (.feature files) for different test scenarios, described a human-readable format. Each feature file should be independent and have its own isolated test data.                                                                                                                                                                                                                                                                      |
| steps                  | Contains steps written in "playwright style", and will be executed for a particular feature defined in the features. For example: `cmsLogin.feature.steps.ts` contains steps for `cmsLogin.feature` file. The steps that can be used across multiple features should be kept in `steps > common` folder. The files `<feature-name>.feature.steps.ts` with naming convention should only contain feature specific step definitions and not any shared steps. |
| pages                  | Contains the Page Object Model (POM) classes which encapsulate the structure and behavior of web pages. Each class in this folder corresponds to a web page or a significant component of a web page. For example: `cmsLogin.steps.ts` contains methods and locators for interacting with the CMS login page.                                                                                                                                               |
| fixtures\*             | Contains test data and fixtures used for running tests. In this folder we have environment specific folders, where each folder will have its own scenario related test data. For example: To test CMS login in automation environment, we have `fixtures > automation > cmsLogin > testdata` hierarchy.                                                                                                                                               |
| .features-gen/features | Contains all the generated test files that describes different scenarios and assertions.                                                                                                                                                                                                                                                                                                                                                                    |
| utils                  | Contains utility functions                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| playwright.config.ts   | Global settings for playwright such as browsers, timeouts, retries, and other project-specific settings.                                                                                                                                                                                                                                                                                                                                                    |

Note: \* The feature file name and its respective test data's folder name should be the same.

# Steps to run locally

1. Install dependencies

   ```
   npm install
   ```

2. Install browsers

   ```
   npx playwright install
   ```

3. Run tests

   ```
   npm test
   ```

4. Run test with a UI executor

   ```
   npm run test -ui
   ```

5. Run subset of tests using --tags option

   ```
   npx bddgen --tags "@regression"
   npx playwright test
   ```

   Reference: [Tag expressions](https://cucumber.io/docs/cucumber/api/?lang=javascript#tag-expressions)

6. Trace Viewer (Post test execution)
   ```
   npx playwright show-trace [trace file path]
   ```
7. Install allure-cli on your machine
   ```
   npm install -g allure-commandline
   ```
8. Generate Allure Report (Post test execution)
   ```
   npm run allure:generate
   ```
   Note: You may face an error if running scripts is disabled on your system. You can run the following in window's command prompt instead, just make sure you are at the root directory.
   ```
   allure generate ./allure-results --clean
   ```
9. Open Allure Report (Post test execution)

   ```
   npm run allure:open
   ```

10. Output:
    ```
    Running 2 tests using 1 worker
    2 passed (2.3s)
    ```

npx bddgen --tags "@smoke"  
 npx playwright test

TAGS=@smoke npm run test
TAGS=@smoke npm run playwright:test -- --ui

11. Running Tests Using Test Suites with TEST_SUITE Env

   We use TEST_SUITE=<NAME> to select which tagged scenarios to run. The mappings are defined in test-suites.json.

   Examples of test-suites.json:

   {
   "ALL": "",
   "REGRESSION": "@regression",
   "SMOKE": "@smoke",
   "CUSTOM": "@smoke and @activityThree"
   }

   Tag Expression Rules

   Run scenarios with both tags

   "CUSTOM": "@smoke and @activityThree"


   → Runs only scenarios that contain both @smoke and @activityThree.

   Run scenarios with either tag

   "CUSTOM": "@smoke or @activityThree"


   → Runs scenarios that have either @smoke or @activityThree.

   Exclude a tag

   "CUSTOM": "@smoke and not @wip"


   → Runs @smoke scenarios but skips those tagged with @wip.

   Combine multiple expressions

   "CUSTOM": "(@activityOne or @activityTwo) and not @wip"


   👉 All activity tags are named as @activityOne, @activityTwo, @activityThree, @activityFour, @activityFive, @activitySix.
