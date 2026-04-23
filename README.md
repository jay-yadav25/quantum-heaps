# Project structure
#Need to add
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
