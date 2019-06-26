import Koa from 'koa';

import {BaseController} from './base-controller';

import {MeetingModel} from '../models/meeting';

export class MeetingsController extends BaseController {
    private populate = ['facilitator'];

    getAll = async (ctx: Koa.Context) => {
        const query = this.validateQueryParams(ctx.query);

        ctx.body = await MeetingModel.find().populate([...this.populate, ...query.populate]);
        ctx.status = 200;
    };
}