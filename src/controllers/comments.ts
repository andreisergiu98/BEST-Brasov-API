import Koa from 'koa';

import {Controller} from '../lib/controller';
import {db} from '../lib/db';

import {Comment} from '../models/comment';

export class CommentsController extends Controller {
    async create(ctx: Koa.Context) {
        const data = ctx.request.body as Comment;
        const user = ctx.state.user;

        if (!data.entityId) {
            ctx.throw(400);
        }

        const comment = new Comment({
            ...data,
            userId: user.id,
            date: new Date(),
        });
        comment.user = user;

        await db.getConnection().manager.save(comment);

        ctx.body = comment;
        ctx.status = 200;
    }
}