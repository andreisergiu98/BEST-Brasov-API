import Koa from "koa";

import Meeting from "../models/meeting";

export const getAll = async (ctx: Koa.Context, next: Function) => {
    ctx.body = await Meeting.find({});
    ctx.status = 200;
};
