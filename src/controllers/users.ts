import Koa from 'koa';

import {config} from '../config';
import {Controller} from '../lib/controller';
import {sessionStorage} from '../lib/session-storage';
import {db} from '../lib/db';

import {User} from '../models/user';

export class UsersController extends Controller {
    async getAll(ctx: Koa.Context) {
        const query = this.parseQuery(ctx.query);
        try {
            ctx.body = await db.getConnection().manager.find(User, {
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
            user = await db.getConnection().manager.findOne(User, {
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
        const data = ctx.request.body;

        if (!data.email) {
            ctx.throw(400);
            return;
        }

        const user = await db.getConnection().manager.findOne(User, {
            where: {email: data.email},
        });

        if (!user) {
            ctx.throw(403);
            return;
        }

        const authKey = await sessionStorage.createSession(user.id, user);
        ctx.cookies.set('auth', authKey, config.cookie);
        ctx.status = 204;
    }

    async authenticate(ctx: Koa.Context) {
        ctx.body = ctx.state.user;
        ctx.status = 200;
    }
}