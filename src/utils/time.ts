function daysToMilliseconds(days: number) {
    return days * 24 * 60 * 60 * 1000;
}

function secondsToDays(seconds: number) {
    return seconds / 60 / 60 / 24;
}

function daysToSeconds(days: number) {
    return days * 24 * 60 * 60;
}

export const time = {
    daysToMilliseconds,
    daysToSeconds,
    secondsToDays,
};