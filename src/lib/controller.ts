import Koa from 'koa';
import qs from 'qs';
import {ObjectId} from 'bson';

export class Controller {
    constructor() {
        this.autoPopulate = [];
    }

    protected autoPopulate: string[];

    protected isObjectIdValid = (id: string | ObjectId) => {
        return ObjectId.isValid(id);
    };
}

export function action(options: { parseQuery?: boolean } = {}) {
    if (!options.parseQuery) {
        options.parseQuery = true;
    }

    return (target: {}, key: string | symbol, descriptor: PropertyDescriptor) => {
        const method = descriptor.value;

        descriptor.value = function (ctx: Koa.Context, next: Function) {
            if (ctx && options.parseQuery) {
                ctx.state.query = parseQuery(ctx.query);
            }

            return method.apply(this, [ctx, next]);
        };

        return descriptor;
    };
}

function parseQuery(query: string) {
    const validQuery = {
        populate: [] as string[],
        conditions: {},
    };

    const parsedQuery = qs.parse(query);

    if (!parsedQuery) {
        return validQuery;
    }

    if (parsedQuery.populate) {
        if (Array.isArray(parsedQuery.populate)) {
            for (const item of parsedQuery.populate) {
                if (typeof item === 'string' || item instanceof String) {
                    validQuery.populate.push(item as string);
                }
            }
        } else {
            if (typeof parsedQuery.populate === 'string' || parsedQuery.populate instanceof String) {
                validQuery.populate = [parsedQuery.populate];
            }
        }
    }

    if (parsedQuery.conditions) {
        validQuery.conditions = parsedQuery.conditions;
    }

    return validQuery;
}