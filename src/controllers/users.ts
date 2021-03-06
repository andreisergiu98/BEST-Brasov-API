import Koa from 'koa';
import Router from 'koa-router-find-my-way';

import {config} from '../config';

import {db} from '../core/db';
import {Controller} from '../core/controller';
import {sessionStorage} from '../core/session-storage';

import {User} from '../models/user';

export class UsersController extends Controller<User> {
    constructor() {
        super(User);
    }

    protected extendRouter = (router: Router.Instance) => {
        router.get('/authentication', this.verifySession);
        router.post('/authentication', this.createSession);
    };

    private verifySession = async (ctx: Koa.Context) => {
        ctx.body = ctx.state.user;
        ctx.status = 200;
    };

    private createSession = async (ctx: Koa.Context) => {
        const data = ctx.request.body as { email?: string };

        if (!data.email) {
            ctx.throw(400);
            return;
        }

        const user = await db.manager.findOne(User, {where: {email: data.email}});

        if (!user) {
            ctx.throw(403);
            return;
        }

        const {sessionId, sessionData} = await sessionStorage.createSession(user, ctx.headers['user-agent']);
        ctx.cookies.set(config.auth.cookieKey, sessionId, config.auth.cookieOptions);
        ctx.body = sessionData;
        ctx.status = 200;
    };

    private deleteSession = async (ctx: Koa.Context) => {
        await sessionStorage.deleteSession(ctx.state.user.session);
        ctx.status = 204;
    };

    private deleteAllSessions = async (ctx: Koa.Context) => {
        // TODO
        ctx.status = 204;
    };
}