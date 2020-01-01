import {SnakeNamingStrategy} from './naming-strategy';

export const snakeCaseNamingStrategy = new SnakeNamingStrategy();

export function initArray<T>(clazz: new (x: T) => T, list?: T[]) {
    if (!list) return;

    return list.map(el => {
        if (el instanceof clazz) {
            return el;
        } else {
            return new clazz(el);
        }
    });
}

export function initOne<T>(clazz: new(x: T) => T, entity?: T) {
    if (!entity) return;
    if (entity instanceof clazz) return entity;
    return new clazz(entity);
}