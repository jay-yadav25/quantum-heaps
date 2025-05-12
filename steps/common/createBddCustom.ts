import { createBdd } from 'playwright-bdd';
import { test } from './customTest.fixture'; // Import your custom test fixture
import env from '../../fixtures/env';


export function createBddCustom() {
    const bdd = createBdd(test);
    const { Given, When, Then, Before, After } = bdd;

    Before(async ({ $testInfo }) => {
        if ($testInfo && $testInfo.title) {
            let scenarioTitle = $testInfo.title;

            // Find the index of the opening and closing brackets
            const startIndex = scenarioTitle.indexOf('["') + 2; // Start after '["'
            const endIndex = scenarioTitle.indexOf('"]');
            if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                // Extract the role used to run scenario inside the brackets
                const role = scenarioTitle.substring(startIndex, endIndex);

                if (env.TARGET_ROLES_FILTER && env.TARGET_ROLES_FILTER.length) {
                    let targetRoles: string[] = env.TARGET_ROLES_FILTER.split(",");
                    // Check if the current role doesn't start with any of the TARGET_ROLES prefixes
                    const shouldSkip = !targetRoles.some(targetRole => role.startsWith(targetRole));
                    if (shouldSkip) {
                        // Skip the test if the current role does not match with target roles 
                        console.log(`Skipping scenario: ${scenarioTitle}`);
                        test.skip();
                        return;
                    }
                }
            }
        }
    });

    return { Given, When, Then, Before, After };
}
