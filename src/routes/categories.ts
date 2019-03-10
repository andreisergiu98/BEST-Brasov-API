import Koa from 'koa';

import Category from '../models/category';

export const getAll = async (ctx: Koa.Context, next: Function) => {
    ctx.body = await Category.find({});
    ctx.status = 200;
};