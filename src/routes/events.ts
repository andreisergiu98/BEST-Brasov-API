import Koa from "koa";
import mongoose from "mongoose";

import Event from "../models/event";

export const getById = async (ctx: Koa.Context, next: Function) => {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.throw(404);
    }

    let {query} = ctx;

    let response = await Event.findById(ctx.params.id).populate(query.populate || '');
    if (response) {
        ctx.status = 200;
        ctx.body = response;
    } else {
        ctx.throw(404);
    }
};

export const getAll = async (ctx: Koa.Context, next: Function) => {
    let {query} = ctx;

    ctx.body = await Event.find({}).populate(query.populate || '');
    ctx.status = 200;
};