import Koa from 'koa';

import {sessionStorage} from '../lib/session-storage';

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
        ctx.cookies.set('auth', '', {
            expires: new Date(),
        });

        ctx.throw(401);
        return;
    }

    if (data.expires) {
        let remainingDays = new Date(data.expires).getTime() - Date.now();
        remainingDays = remainingDays / 1000 / 60 / 60 / 24;

        if (remainingDays < 1) {
            await sessionStorage.extendSession(authKey, data);
        }
    }

    ctx.state.user = data;
    await next();
};