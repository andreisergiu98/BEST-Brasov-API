import Koa from 'koa';

import {Controller, mountQueryToState} from '../lib/controller';

import {MeetingModel} from '../models/meeting';

export class MeetingsController extends Controller {
    @mountQueryToState()
    async getAll(ctx: Koa.Context) {
        const {query} = ctx.state;
        ctx.body = await MeetingModel.find(query.conditions).populate(query.populate).select(query.fields).lean();
        ctx.status = 200;
    }
}