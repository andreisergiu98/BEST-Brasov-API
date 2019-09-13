import Koa from 'koa';

import {config} from '../config';
import {Controller} from '../core/controller';
import {sessionStorage} from '../core/session-storage';
import {db} from '../core/db';

import {User} from '../models/user';

export class UsersController extends Controller {
    async getAll(ctx: Koa.Context) {
        const query = this.parseQuery(ctx.query);
        try {
            ctx.body = await db.getManager().find(User, {
                where: query.conditions,
                relations: query.populate,
                select: query.fields,
                skip: query.offset,
                take: query.limit,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.status = 200;
    }

    async getById(ctx: Koa.Context) {
        const query = this.parseQuery(ctx.query);
        let user;
        try {
            user = await db.getManager().findOne(User, {
                where: {id: ctx.params.id},
                relations: query.populate,
                select: query.fields,
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

    async login(ctx: Koa.Context) {
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

    async authenticate(ctx: Koa.Context) {
        ctx.body = ctx.state.user;
        ctx.status = 200;
    }
}