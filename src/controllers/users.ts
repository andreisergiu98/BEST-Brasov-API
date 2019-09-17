import Koa from 'koa';

import {config} from '../config';
import {Controller} from '../core/controller';
import {sessionStorage} from '../core/session-storage';
import {db} from '../core/db';

import {User} from '../models/user';

export class UsersController extends Controller {
    async getAll(ctx: Koa.Context) {
        const dbQuery = this.getDatabaseQuery(ctx.state.query);
        try {
            ctx.body = await db.getManager().find(User, {
                where: dbQuery.conditions,
                relations: dbQuery.populate,
                select: dbQuery.fields,
                skip: dbQuery.offset,
                take: dbQuery.limit,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.status = 200;
    }

    async getById(ctx: Koa.Context) {
        const dbQuery = this.getDatabaseQuery(ctx.state.query);
        let user;
        try {
            user = await db.getManager().findOne(User, {
                where: {id: ctx.params.id},
                relations: dbQuery.populate,
                select: dbQuery.fields,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }

        if (!user) {
            ctx.throw(404);
        }

        ctx.body = user;
        ctx.status = 200;
    }

    async createSession(ctx: Koa.Context) {
        const data = ctx.request.body as { email?: string };

        if (!data.email) {
            ctx.throw(400);
            return;
        }

        const user = await db.getManager().findOne(User, {where: {email: data.email}});

        if (!user) {
            ctx.throw(403);
            return;
        }

        const authKey = await sessionStorage.createSession(user.id, user, ctx.headers['user-agent']);
        ctx.cookies.set(config.auth.cookieKey, authKey, config.auth.cookieOptions);
        ctx.status = 204;
    }

    async verifySession(ctx: Koa.Context) {
        ctx.body = ctx.state.user;
        ctx.status = 200;
    }

    async deleteSession(ctx: Koa.Context) {
        const key = ctx.params.key;

        if (!key.startsWith(ctx.state.user.id + sessionStorage.separator)) {
            ctx.throw(403);
            return;
        }

        await sessionStorage.deleteSession(key);
        ctx.status = 204;
    }

    async deleteAllSessions(ctx: Koa.Context) {
        await sessionStorage.deleteAllSessions(ctx.state.user.id);
        ctx.status = 204;
    }
}