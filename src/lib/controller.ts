import Koa from 'koa';
import qs from 'qs';
import autoBind from 'auto-bind';
import {object} from '../utils/object';

export class Controller {
    constructor() {
        autoBind(this as {});
    }
}

export function mountQueryToState() {
    return (target: {}, key: string | symbol, descriptor: PropertyDescriptor) => {
        const method = descriptor.value;

        descriptor.value = function (ctx: Koa.Context, next: Function) {
            if (ctx) {
                ctx.state.query = parseQuery(ctx.query);
            }

            return method.apply(this, [ctx, next]);
        };

        return descriptor;
    };
}

function parseQuery(query: string) {
    const validQuery = {
        populate: undefined as string[] | undefined,
        fields: undefined as string[] | undefined,
        conditions: {},
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

    if (object.isPlainObject(parsedQuery.conditions)) {
        validQuery.conditions = parsedQuery.conditions;
    }

    return validQuery;
}