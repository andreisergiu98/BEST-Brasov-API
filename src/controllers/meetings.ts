import Koa from 'koa';

import {Controller, mountQueryToState} from '../lib/controller';
import {db} from '../lib/db';

import {Meeting} from '../models/meeting';

export class MeetingsController extends Controller {
    @mountQueryToState()
    async getAll(ctx: Koa.Context) {
        let meetings;
        try {
            const {query} = ctx.state;
            meetings = await db.getConnection().getRepository(Meeting).find({
               where: query.conditions,
               relations: query.populate,
               select: query.fields,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }

        ctx.body = meetings;
        ctx.status = 200;
    }
}