import Koa from 'koa';
import qs from 'qs';
import {ObjectId} from 'bson';
import {Ref} from 'typegoose';
import autoBind from 'auto-bind';
import {object} from '../utils/object';

export class Controller {
    constructor() {
        // tslint:disable-next-line:no-any
        autoBind(this as any);
    }

    protected isObjectIdValid(id: string | ObjectId | Ref<{}>) {
        return ObjectId.isValid(id as string | ObjectId);
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
        populate: [] as string[],
        conditions: {},
        fields: '',
    };

    const parsedQuery = qs.parse(query);
    if (!parsedQuery) {
        return validQuery;
    }

    if (parsedQuery.populate) {
        if (Array.isArray(parsedQuery.populate)) {
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

    if (parsedQuery.fields && object.isString(parsedQuery.fields)) {
        const fields = parsedQuery.fields.split(' ');
        let exclusion = false;
        let inclusion = false;

        for (const field of fields) {
            if (field.length > 0) {
                if (field[0] === '-') {
                    exclusion = true;
                } else {
                    inclusion = true;
                }
            }
            if (exclusion && inclusion) {
                break;
            }
        }

        if (exclusion !== inclusion) {
            validQuery.fields = parsedQuery.fields;
        }
    }

    if (object.isPlainObject(parsedQuery.conditions)) {
        validQuery.conditions = parsedQuery.conditions;
    }

    return validQuery;
}