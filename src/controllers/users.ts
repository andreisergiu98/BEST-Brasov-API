import Koa from 'koa';

import {config} from '../config';

import {db} from '../core/db';
import {Controller} from '../core/controller';
import {sessionStorage} from '../core/session-storage';

import {User} from '../models/user';

export class UsersController extends Controller<User> {
    constructor() {
        super(User);
        this.router.get('/authentication', this.verifySession);
        this.router.post('/authentication', this.createSession);
    }

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

        const authKey = await sessionStorage.createSession(user, ctx.headers['user-agent']);
        ctx.cookies.set(config.auth.cookieKey, authKey, config.auth.cookieOptions);
        ctx.status = 204;
    };

    private deleteSession = async (ctx: Koa.Context) => {
        // TODO
        ctx.status = 204;
    };

    private deleteAllSessions = async (ctx: Koa.Context) => {
        // TODO
        ctx.status = 204;
    };
}