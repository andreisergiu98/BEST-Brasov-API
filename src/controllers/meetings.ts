import Koa from 'koa';

import {Controller, mountQueryToState} from '../lib/controller';
import {db} from '../lib/db';

import {Meeting} from '../models/meeting';

export class MeetingsController extends Controller {
    @mountQueryToState()
    async getAll(ctx: Koa.Context) {
        try {
            const {query} = ctx.state;
            ctx.body = await db.getConnection().manager.find(Meeting, {
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