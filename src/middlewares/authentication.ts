import Koa from 'koa';

import {sessionStorage} from '../core/session-storage';
import {config} from '../config';
import {time} from '../utils/time';

export async function authentication(ctx: Koa.Context, next: Function) {
    if (ctx.method === 'POST' && ctx.url === '/authentication') {
        return next();
    }
    const cookieKey = config.auth.cookieKey;

    const sessionId = ctx.cookies.get(cookieKey);

    if (!sessionId) {
        ctx.throw(401);
        return;
    }

    const session = await sessionStorage.getSession(sessionId);

    if (!session) {
        ctx.cookies.set(cookieKey, '', {
            expires: new Date(),
            overwrite: true,
        });
        ctx.throw(401);
        return;
    }

    if (time.millisecondsToDays(session.pttl) < 1) {
        session.pttl = config.auth.maxAge;
        await sessionStorage.extendSession(sessionId, session.id);
        ctx.cookies.set(cookieKey, sessionId, config.auth.cookieOptions);
    }

    ctx.state.user = session;
    return next();
}