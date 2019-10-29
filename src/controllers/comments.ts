import Koa from 'koa';

import {RBAC} from '../core/rbac';
import {Controller, ControllerOptions} from '../core/controller';

import {Comment} from '../models/comment';

export class CommentsController extends Controller<Comment> {
    constructor() {
        super(Comment, commentsOptions);
    }
}

function tagUser(ctx: Koa.Context, next: Function) {
    if (ctx.request.body) {
        ctx.request.body.userId = ctx.state.user.id;
        ctx.request.body.date = new Date();
    }
    return next();
}

const commentsOptions: ControllerOptions = {
    create: {
        pre: tagUser,
    },
    update: {
        disabled: true,
    },
    delete: {
        access: RBAC.roles.admin,
    },
};