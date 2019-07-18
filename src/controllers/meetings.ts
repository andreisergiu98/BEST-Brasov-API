import Koa from 'koa';

import {Controller, action} from '../lib/controller';

import {MeetingModel} from '../models/meeting';

export class MeetingsController extends Controller {
    constructor() {
        super();

        this.autoPopulate = ['facilitator'];
    }

    @action()
    async getAll(ctx: Koa.Context) {
        const {query} = ctx.state;
        const populate = this.mergeWithAutoPopulate(query.populate);
        const conditions = query.conditions;

        ctx.body = await MeetingModel.find(conditions).populate(populate).lean();
        ctx.status = 200;
    }
}