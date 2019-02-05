import Entity from "../models/entity";
import mongoose from "mongoose";

export const getById = async (ctx: any, next: Function) => {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.throw(400, 'Invalid data!');
    }

    try {
        let response = await Entity.findById(ctx.params.id);
        if (response) {
            ctx.status = 200;
            ctx.body = response;
        } else {
            ctx.throw(404, 'Entity not found');
        }
    } catch (err) {
        ctx.throw(err.status || 500, err.message || 'Internal error, cannot fetch entity');
    }
};

export const getAllEntities = async (ctx: any, next: Function) => {
    try {
        let response = await Entity.find({});
        ctx.status = 200;
        ctx.body = response;
    } catch (err) {
        ctx.throw(err.status || 500, err.message || 'Internal error, cannot fetch users');
    }
};