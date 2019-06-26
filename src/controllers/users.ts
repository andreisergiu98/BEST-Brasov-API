import Koa from 'koa';

import {BaseController} from './base-controller';

import {UserModel} from '../models/user';

export class UsersController extends BaseController {
    private populate = [];

    getById = async (ctx: Koa.Context) => {
        if (!this.isObjectIdValid(ctx.params.id)) {
            ctx.throw(404);
            return;
        }

        const query = this.validateQueryParams(ctx.query);

        const user = await UserModel.findById(ctx.params.id).populate([...this.populate, ...query.populate]).lean();

        if (user) {
            ctx.status = 200;
            ctx.body = user;
        } else {
            ctx.throw(404);
        }
    };

    getAll = async (ctx: Koa.Context) => {
        const query = this.validateQueryParams(ctx.query);

        ctx.body = await UserModel.find(query.conditions).populate([...this.populate, ...query.populate]).lean();
        ctx.status = 200;
    };
}