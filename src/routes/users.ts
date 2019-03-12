import Koa from 'koa';
import mongoose from "mongoose";

import User from '../models/user';

export const getById = async (ctx: Koa.Context, next: Function) => {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.throw(404);
    }

    let response = await User.findById(ctx.params.id);
    if (response) {
        ctx.status = 200;
        ctx.body = response;
    } else {
        ctx.throw(404);
    }
};

export const getAll = async (ctx: Koa.Context, next: Function) => {
    ctx.body = await User.find({});
    ctx.status = 200;
};