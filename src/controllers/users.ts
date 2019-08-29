import Koa from 'koa';

import {config} from '../config';
import {Controller, mountQueryToState} from '../lib/controller';
import {sessionStorage} from '../lib/session-storage';
import {db} from '../lib/db';

import {User} from '../models/user';

export class UsersController extends Controller {
    @mountQueryToState()
    async getById(ctx: Koa.Context) {
        let user;
        try {
            const {query} = ctx.state;
            user = await db.getConnection().getRepository(User).findOne({
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

    @mountQueryToState()
    async getAll(ctx: Koa.Context) {
        let users;
        try {
            const {query} = ctx.state;
            users = await db.getConnection().getRepository(User).find({
                where: query.conditions,
                relations: query.populate,
                select: query.fields,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }

        ctx.body = users;
        ctx.status = 200;
    }

    async authenticate(ctx: Koa.Context) {
        ctx.body = ctx.state.user;
        ctx.status = 200;
    }

    async login(ctx: Koa.Context) {
        const data = ctx.request.body;

        if (!data.email) {
            ctx.throw(400);
            return;
        }

        const user = await db.getConnection().getRepository(User).findOne({
            where: {email: data.email},
        });

        if (!user) {
            ctx.throw(403);
            return;
        }

        const userData = {id: user.id, name: user.name, role: user.role, photo: user.photo};
        const authKey = await sessionStorage.createSession(user.id, userData);

        ctx.cookies.set('auth', authKey, config.cookie);
        ctx.body = userData;
        ctx.status = 200;
    }
}