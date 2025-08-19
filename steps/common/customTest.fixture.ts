import { test as base } from 'playwright-bdd';
import env from '../../fixtures/env';
import * as path from 'path';

export const test = base.extend<{ testData: any, loginData: any }>({
    testData: async ({ page }: any, use: (arg0: any) => any, testInfo: any) => {
        const environment = "automation";
        const featureFileName = path.basename(testInfo.file, '.js');
        const feature = featureFileName.split('.')[0];
        const dataPath = `../../fixtures/${environment}/${feature}/testdata.json`;
        const testdata = require(dataPath);
        await use(testdata);
    },
    loginData: async ({ page }: any, use: (arg0: any) => any, testInfo: any) => {
        const environment = "automation";
        const featureFileName = path.basename(testInfo.file, '.js');
        const feature = featureFileName.split('.')[0];
        const dataPath = `../../fixtures/${environment}/${feature}/loginData.json`;
        const testdata = require(dataPath);
        await use(testdata);
    }
});
