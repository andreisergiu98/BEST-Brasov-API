import {DefaultNamingStrategy, NamingStrategyInterface} from 'typeorm';
import {snakeCase} from 'typeorm/util/StringUtils';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join('_'));
    }

    columnNameCustomized(customName: string): string {
        return customName;
    }
}

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

export const models = {
    initArray,
    initOne,
};