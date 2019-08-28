import Koa from 'koa';

import {config} from '../config';
import {Controller, mountQueryToState} from '../lib/controller';
import {sessionStorage} from '../lib/session-storage';

import {UserModel} from '../models/user';

export class UsersController extends Controller {
    @mountQueryToState()
    async getById(ctx: Koa.Context) {
        if (!this.isObjectIdValid(ctx.params.id)) {
            ctx.throw(404);
            return;
        }

        const {query} = ctx.state;
        const user = await UserModel.findById(ctx.params.id).populate(query.populate).select(query.fields).lean();

        if (user) {
            ctx.status = 200;
            ctx.body = user;
        } else {
            ctx.throw(404);
        }
    }

    @mountQueryToState()
    async getAll(ctx: Koa.Context) {
        const {query} = ctx.state;
        ctx.body = await UserModel.find(query.conditions).populate(query.populate).select(query.fields).lean();
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

        const user = await UserModel.findOne({email: data.email});

        if (!user) {
            ctx.throw(403);
            return;
        }

        const userData = {id: user._id, name: user.name, role: user.role};
        const authKey = await sessionStorage.createSession(user._id, userData);

        ctx.cookies.set('auth', authKey, config.cookie);
        ctx.body = userData;
        ctx.status = 200;
    }
}