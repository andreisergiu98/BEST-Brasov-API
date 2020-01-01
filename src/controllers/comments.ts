import Koa from 'koa';

import {RBAC} from '../core/rbac';
import {Controller, ControllerOptions} from '../core/controller';

import {Comment} from '../models/comment';

export class CommentsController extends Controller<Comment> {
    constructor() {
        super(Comment, commentsOptions);
    }
}

async function tagUser(ctx: Koa.Context) {
    if (ctx.request.body) {
        ctx.request.body.userId = ctx.state.user.id;
        ctx.request.body.date = new Date();
    }
}

const commentsOptions: ControllerOptions = {
    create: {
        preHooks: tagUser,
    },
    update: {
        disabled: true,
    },
    delete: {
        access: RBAC.roles.admin,
    },
};