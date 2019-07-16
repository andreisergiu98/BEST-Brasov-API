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

        ctx.body = await MeetingModel.find().populate([...this.autoPopulate, ...query.populate]);
        ctx.status = 200;
    }
}