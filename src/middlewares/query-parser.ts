import Koa from 'koa';
import qs from 'qs';

export interface QueryParserOptions {
    get?: boolean;
    post?: boolean;
    put?: boolean;
    patch?: boolean;
    del?: boolean;
}

export function queryParser(options: QueryParserOptions = {get: true}) {
    return async (ctx: Koa.Context, next: Function) => {
        if (!options.get && ctx.method === 'GET') {
            return next();
        }
        if (!options.post && ctx.method === 'POST') {
            return next();
        }
        if (!options.put && ctx.method === 'PUT') {
            return next();
        }
        if (!options.patch && ctx.method === 'PATCH') {
            return next();
        }
        if (!options.del && ctx.method === 'DEL') {
            return next();
        }

        if (ctx.querystring) {
            const parsedQuery = qs.parse(ctx.querystring);
            if (parsedQuery) {
                ctx.state.query = parsedQuery;
            }
        }

        return next();
    };
}