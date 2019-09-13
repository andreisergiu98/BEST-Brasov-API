import Koa from 'koa';

import {Controller} from '../core/controller';
import {db} from '../core/db';

import {Comment} from '../models/comment';

export class CommentsController extends Controller {
    async create(ctx: Koa.Context) {
        const data = ctx.request.body as Comment | undefined;
        const user = ctx.state.user;

        if (!data) {
            ctx.throw(400);
            return;
        }

        if (!data.entityId) {
            ctx.throw(400);
        }

        data.userId = user.id;
        data.date = new Date();

        const comment = new Comment(data);
        comment.user = user;

        await db.getManager().save(comment);

        ctx.body = comment;
        ctx.status = 200;
    }
}