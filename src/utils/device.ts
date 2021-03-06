import {UAParser} from 'ua-parser-js';

export interface Device {
    browser: string;
    os: string;
}

function getInfo(useragent: string): Device {
    const parser = new UAParser(useragent);
    const result = parser.getResult();

    return {
        browser: result.browser.name || 'unknown',
        os: result.os.name || 'unknown',
    };
}

export const device = {
    getInfo,
};