import { Page, Locator, TestInfo } from '@playwright/test';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export interface AccessibilityScanOptions {
  page: Page;
  testInfo?: TestInfo;
  scanType: 'fullPage' | 'iframe' | 'element';
  selector?: string;
  attachmentName?: string;
}

//Below is format to call this function
// // 1. Scan full page
// await performAccessibilityScan({
//   page: this.page,
//   testInfo,
//   scanType: 'fullPage',
//   attachmentName: 'full-page-accessibility'
// });

// // 2. Scan iframe
// await performAccessibilityScan({
//   page: this.page,
//   testInfo,
//   scanType: 'iframe',
//   attachmentName: 'iframe-accessibility'
// });

// // 3. Scan specific element
// const myLocator = page.locator('.some-specific-element');
// await performAccessibilityScan({
//   page: this.page,
//   testInfo,
//   scanType: 'element',
//   locator: myLocator,
//   attachmentName: 'element-accessibility'
// });
export async function performAccessibilityScan(options: AccessibilityScanOptions) {
  const { page, testInfo, scanType, selector, attachmentName = 'accessibility-scan' } = options;
  
  let axeBuilder = new AxeBuilder({ page });
  
  try {
    switch (scanType) {
      case 'fullPage':
        // Scan the entire page 
        break;
        
      case 'iframe':
        // Scan specific iframe with class .wk_ex_iframe
        axeBuilder.include('.wk_ex_iframe');
        break;
        
      case 'element':
        if (!selector) {
          throw new Error('Locator is required when scanType is "element"');
        }
        
        axeBuilder.include(selector);
        break;
        
      default:
        throw new Error(`Invalid scanType: ${scanType}. Must be 'fullPage', 'iframe', or 'element'`);
    }
    
    const results = await axeBuilder.analyze();
    
    expect(results.violations).toEqual([]);
    
    const filteredResults = {
      violations: results.violations,
      incomplete: results.incomplete
    };

    if (testInfo) {
      await testInfo.attach(attachmentName, {
        body: JSON.stringify(filteredResults, null, 2),
        contentType: 'application/json'
      });
    }
    
    return filteredResults;
    
  } catch (error) {
    throw new Error(`Accessibility scan failed: ${error.message}`);
  }
}

