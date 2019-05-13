import Koa from 'koa';

import Meeting from '../models/meeting';

export const getAll = async (ctx: Koa.Context, next: Function) => {
    const {query} = ctx;

    ctx.body = await Meeting.find({}).populate(query.populate || '');
    ctx.status = 200;
};
