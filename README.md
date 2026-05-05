# QUANTUM — Playwright BDD Test Suite

## Project Structure

```
QUANTUM/
├── auth.ts                          # One-time session capture script
├── auth.json                        # Saved login session (gitignored)
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration
├── test-suites.json                 # Tag-to-suite mappings
├── package.json
│
├── features/                        # Gherkin feature files
│   └── shopping.feature
│
├── steps/                           # Step definitions
│   ├── common/
│   │   └── createBddCustom.ts
│   └── shopping/
│       └── step.ts
│
├── pages/                           # Page Object Models
│   └── Shopping.page.ts
│
├── testData/                        # Test data
│   └── testData.json
│
├── allure-results/                  # Raw allure output (post-run)
└── allure-report/                   # Generated allure report (post-run)
```

---

## Steps to Run Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Install browsers
```bash
npx playwright install
```

### 3. Save login session (run once before tests)
```bash
npx playwright test auth.ts --headed --project=chromium
```
> Log in manually in the browser, enter OTP, then click **▶ Resume** in the Playwright inspector. This saves `auth.json` to the project root.

### 4. Run tests
```bash
npm test
```

### 5. Run tests with UI executor
```bash
npm run test:ui
```

### 6. Run a subset of tests using tags
```bash
npx bddgen --tags "@regression"
npx playwright test
```
Or in one command:
```bash
TAGS=@smoke npm run test
```
With UI:
```bash
TAGS=@smoke npm run playwright:test -- --ui
```

Reference: [Cucumber Tag Expressions](https://cucumber.io/docs/cucumber/api/?lang=javascript#tag-expressions)

---

## Running Tests Using Test Suites

Use `TEST_SUITE=<NAME>` to select which tagged scenarios to run. Mappings are defined in `test-suites.json`.

**Example `test-suites.json`:**
```json
{
  "ALL": "",
  "REGRESSION": "@regression",
  "SMOKE": "@smoke",
  "CUSTOM": "@smoke and @activityThree"
}
```

**Run a suite:**
```bash
TEST_SUITE=SMOKE npm test
TEST_SUITE=REGRESSION npm test
TEST_SUITE=CUSTOM npm test
```

### Tag Expression Rules

| Expression | Behaviour |
|---|---|
| `"@smoke and @activityThree"` | Runs scenarios that have **both** tags |
| `"@smoke or @activityThree"` | Runs scenarios that have **either** tag |
| `"@smoke and not @wip"` | Runs `@smoke` but **skips** anything tagged `@wip` |
| `"(@activityOne or @activityTwo) and not @wip"` | Combines multiple expressions |

> All activity tags are: `@activityOne`, `@activityTwo`, `@activityThree`, `@activityFour`, `@activityFive`, `@activitySix`

---

## Reporting

### Trace Viewer (post test execution)
```bash
npx playwright show-trace [trace file path]
```

### Install Allure CLI
```bash
npm install -g allure-commandline
```

### Generate Allure Report (post test execution)
```bash
npm run allure:generate
```
> **Note:** If you get a script execution error on Windows, run this from the root directory in Command Prompt instead:
> ```
> allure generate ./allure-results --clean
> ```

### Open Allure Report (post test execution)
```bash
npm run allure:open
```

---

## Expected Output
```
Running 3 tests using 1 worker
3 passed (12.4s)
```

---

## Notes

- `auth.json` contains your login session — **add it to `.gitignore`** and never commit it
- Re-run `auth.ts` whenever your session expires or OTP invalidates
- `storageState: 'auth.json'` is set in `playwright.config.ts` so all tests inherit the session automatically