import * as LMSStrings from '../fixtures/constants/lms-en-us.json'

export function l10n(id: string, site: string, args?: any, noOFAttempts1?: string, noOFAttempts2?: string) {
    let str: string = "undefined";
    switch (site) {
        case 'LMS':
            str = LMSStrings[id as keyof typeof LMSStrings] as string;
            break;
    }
    if (args) {
        str = str.replace(/\{\{([^\}]+)\}\}/g, function (
            g0: any,
            g1: any,
            g2: any
        ): string {
            return String(args[g1 as number]);
        });
    }
    return str;
}