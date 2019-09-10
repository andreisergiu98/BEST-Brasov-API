import Koa from 'koa';

import {sessionStorage} from '../lib/session-storage';
import {config} from '../config';

export const authentication = async (ctx: Koa.Context, next: Function) => {
    if (ctx.method === 'POST' && ctx.url === '/authentication') {
        return next();
    }

    const authKey = ctx.cookies.get('auth');

    if (!authKey) {
        ctx.throw(401);
        return;
    }

    const data = await sessionStorage.getSession(authKey);

    if (!data) {
        ctx.cookies.set(config.auth.cookieKey, '', {expires: new Date()});
        ctx.throw(401);
        return;
    }

    const remainingDays = (data.expires - Date.now()) / (1000 * 60 * 60 * 24);
    if (remainingDays < 1) {
        await sessionStorage.extendSession(authKey, data);
        ctx.cookies.set(config.auth.cookieKey, authKey, config.auth.cookieOptions);
    }

    ctx.state.user = data;
    await next();
};