import Koa from 'koa';
import {config} from '../config';

export async function catchError(ctx: Koa.Context, next: Function) {
    try {
        await next();
    } catch (e) {
        ctx.status = e.status || 500;
        ctx.body = e.message;

        if (ctx.status === 500) {
            ctx.body = 'Internal Server Error';
        } else if (config.isProduction) {
            return;
        }

        ctx.app.emit('error', e, ctx);
    }
}

export async function logError(e: Error) {
    console.log(e.message);
}
