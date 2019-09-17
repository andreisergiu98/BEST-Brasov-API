import Koa from 'koa';

import {Controller} from '../core/controller';
import {db} from '../core/db';

import {Meeting} from '../models/meeting';

export class MeetingsController extends Controller {
    async getAll(ctx: Koa.Context) {
        const dbQuery = this.getDatabaseQuery(ctx.state.query);
        try {
            ctx.body = await db.getManager().find(Meeting, {
                where: dbQuery.conditions,
                relations: dbQuery.populate,
                select: dbQuery.fields,
                skip: dbQuery.offset,
                take: dbQuery.limit,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.status = 200;
    }
}