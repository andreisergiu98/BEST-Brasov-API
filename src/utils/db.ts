import {DefaultNamingStrategy, NamingStrategyInterface} from 'typeorm';
import {snakeCase} from 'typeorm/util/StringUtils';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join("_"));
    }

    columnNameCustomized(customName: string): string {
        return customName;
    }
}