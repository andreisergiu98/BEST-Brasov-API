function isPlainObject(item?: unknown): boolean {
    if (!item) {
        return false;
    }
    return Object.prototype.toString.call(item) === '[object Object]';
}

function isString(object?: unknown): boolean {
    if (!object) {
        return false;
    }
    return typeof object === 'string' || object instanceof String;
}

export const object = {
    isPlainObject,
    isString,
};