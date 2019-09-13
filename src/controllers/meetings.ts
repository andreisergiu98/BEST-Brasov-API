import Koa from 'koa';

import {Controller} from '../core/controller';
import {db} from '../core/db';

import {Meeting} from '../models/meeting';

export class MeetingsController extends Controller {
    async getAll(ctx: Koa.Context) {
        const query = this.parseQuery(ctx.query);
        try {
            ctx.body = await db.getManager().find(Meeting, {
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
}