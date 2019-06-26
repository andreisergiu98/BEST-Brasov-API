import {ObjectId} from 'bson';

interface QueryParams {
    conditions: {};
    populate: string[];
}

export class BaseController {
    protected validateQueryParams = (query: { populate: string[] | string | undefined, conditions: {} | undefined } | undefined) => {
        const validQuery = {} as QueryParams;
        validQuery.populate = [];
        validQuery.conditions = {};

        if (!query) {
            return validQuery;
        }

        if (query.populate) {
            if (Array.isArray(query.populate)) {
                validQuery.populate = query.populate;
            } else {
                validQuery.populate = [query.populate];
            }
        }

        if (query.conditions) {
            validQuery.conditions = query.conditions;
        }

        return validQuery;
    };

    protected isObjectIdValid = (id: string | ObjectId) => {
        return ObjectId.isValid(id);
    };
}