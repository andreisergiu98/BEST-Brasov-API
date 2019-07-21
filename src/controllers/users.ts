import Koa from 'koa';

import {config} from '../lib/config';
import {Controller, action} from '../lib/controller';
import {sessionStorage} from '../lib/session-storage';

import {UserModel} from '../models/user';

export class UsersController extends Controller {
    constructor() {
        super();
    }

    @action({parseQuery: false})
    async login(ctx: Koa.Context) {
        const data = ctx.request.body;

        if (!data.email) {
            ctx.throw(400);
            return;
        }

        const users = await UserModel.find({email: data.email});

        if (users.length === 0) {
            ctx.throw(403);
            return;
        }

        const user = users[0];
        const userData = {id: user._id, name: user.name, role: user.role};
        const auth = await sessionStorage.createSession(user._id, userData);

        ctx.cookies.set('auth', auth, config.cookie);
        ctx.body = userData;
        ctx.status = 200;
    }

    @action({parseQuery: false})
    async authenticate(ctx: Koa.Context) {
        ctx.body = ctx.state.user;
        ctx.status = 200;
    }


    @action()
    async getById(ctx: Koa.Context) {
        if (!this.isObjectIdValid(ctx.params.id)) {
            ctx.throw(404);
            return;
        }

        const {query} = ctx.state;
        const populate = this.mergeWithAutoPopulate(query.populate);

        const user = await UserModel.findById(ctx.params.id).populate(populate).lean();

        if (user) {
            ctx.status = 200;
            ctx.body = user;
        } else {
            ctx.throw(404);
        }
    }

    @action()
    async getAll(ctx: Koa.Context) {
        const {query} = ctx.state;
        const populate = this.mergeWithAutoPopulate(query.populate);
        const conditions = query.conditions;

        ctx.body = await UserModel.find(conditions).populate(populate).lean();
        ctx.status = 200;
    }
}