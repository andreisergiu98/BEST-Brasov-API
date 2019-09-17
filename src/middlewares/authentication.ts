import Koa from 'koa';

import {sessionStorage} from '../core/session-storage';
import {config} from '../config';
import {time} from '../utils/time';

export async function authentication(ctx: Koa.Context, next: Function) {
    if (ctx.method === 'POST' && ctx.url === '/authentication') {
        return next();
    }

    const authKey = ctx.cookies.get(config.auth.cookieKey);

    if (!authKey) {
        ctx.throw(401);
        return;
    }

    const data = await sessionStorage.getSession(authKey);

    if (!data) {
        ctx.cookies.set(config.auth.cookieKey, '', {expires: new Date(), overwrite: true});
        ctx.throw(401);
        return;
    }

    const remainingDays = (data.expires - Date.now()) / time.daysToMilliseconds(1);
    if (remainingDays < 1) {
        await sessionStorage.extendSession(authKey, data);
        ctx.cookies.set(config.auth.cookieKey, authKey, config.auth.cookieOptions);
        data.expires = Date.now() + config.auth.maxAge;
    }

    ctx.state.user = data;
    return next();
}