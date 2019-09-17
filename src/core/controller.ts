import autoBind from 'auto-bind';

import {object} from '../utils/object';

interface ParsedQuery {
    populate?: string | string[];
    fields?: string | string[];
    conditions?: object;
    limit?: string;
    offset?: string;
}

export class Controller {
    constructor() {
        autoBind(this as {});
    }

    getDatabaseQuery(query?: ParsedQuery) {
        const validQuery = {
            // tslint:disable-next-line:no-any
            fields: undefined as any[] | undefined,
            conditions: {} as object,
            populate: undefined as string[] | undefined,
            limit: undefined as number | undefined,
            offset: undefined as number | undefined,
        };

        if (!query) {
            return validQuery;
        }

        if (query.populate) {
            if (Array.isArray(query.populate)) {
                validQuery.populate = [];
                for (const item of query.populate) {
                    if (object.isString(item)) {
                        validQuery.populate.push(item);
                    }
                }
            } else {
                if (object.isString(query.populate)) {
                    validQuery.populate = [query.populate];
                }
            }
        }

        if (query.fields) {
            if (Array.isArray(query.fields)) {
                validQuery.fields = [];
                for (const item of query.fields) {
                    if (object.isString(item)) {
                        validQuery.fields.push(item);
                    }
                }
            } else {
                if (object.isString(query.fields)) {
                    validQuery.fields = [query.fields];
                }
            }
        }

        const limit = Number(query.limit);
        if (!isNaN(limit) && limit > 0) {
            validQuery.limit = limit;
        }

        const offset = Number(query.offset);
        if (!isNaN(offset) && offset > 0) {
            validQuery.offset = offset;
        }

        if (query.conditions && object.isPlainObject(query.conditions)) {
            validQuery.conditions = query.conditions;
        }

        return validQuery;
    }
}
