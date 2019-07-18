import Koa from 'koa';

import {Controller, action} from '../lib/controller';

import {UserModel} from '../models/user';

export class UsersController extends Controller {
    constructor() {
        super();
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