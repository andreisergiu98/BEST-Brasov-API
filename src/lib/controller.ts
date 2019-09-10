import qs from 'qs';
import autoBind from 'auto-bind';
import {object} from '../utils/object';

export class Controller {
    constructor() {
        autoBind(this as {});
    }

    parseQuery = (query: string) => {
        const validQuery = {
            // tslint:disable-next-line:no-any
            fields: undefined as any[] | undefined,
            conditions: {} as object,
            populate: undefined as string[] | undefined,
            limit: undefined as number | undefined,
            offset: undefined as number | undefined,
        };

        const parsedQuery = qs.parse(query);
        if (!parsedQuery) {
            return validQuery;
        }

        if (parsedQuery.populate) {
            if (Array.isArray(parsedQuery.populate)) {
                validQuery.populate = [];
                for (const item of parsedQuery.populate) {
                    if (object.isString(item)) {
                        validQuery.populate.push(item);
                    }
                }
            } else {
                if (object.isString(parsedQuery.populate)) {
                    validQuery.populate = [parsedQuery.populate];
                }
            }
        }

        if (parsedQuery.fields) {
            if (Array.isArray(parsedQuery.fields)) {
                validQuery.fields = [];
                for (const item of parsedQuery.fields) {
                    if (object.isString(item)) {
                        validQuery.fields.push(item);
                    }
                }
            } else {
                if (object.isString(parsedQuery.fields)) {
                    validQuery.fields = [parsedQuery.fields];
                }
            }
        }

        const limit = Number(parsedQuery.limit);
        if (!isNaN(limit) && limit > 0) {
            validQuery.limit = limit;
        }

        const offset = Number(parsedQuery.offset);
        if (!isNaN(offset) && offset > 0) {
            validQuery.offset = parsedQuery.offset;
        }

        if (object.isPlainObject(parsedQuery.conditions)) {
            validQuery.conditions = parsedQuery.conditions;
        }

        return validQuery;
    }
}
