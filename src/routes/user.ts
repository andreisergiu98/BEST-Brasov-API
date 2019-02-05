import User from '../models/user';
import mongoose from "mongoose";

export const getById = async (ctx: any, next: Function) => {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.throw(400, 'Invalid data!');
    }

    try {
        let response = await User.findById(ctx.params.id);
        if (response) {
            ctx.status = 200;
            ctx.body = response;
        } else {
            ctx.throw(404, 'User not found');
        }
    } catch (err) {
        ctx.throw(err.status || 500, err.message || 'Internal error, cannot fetch user');
    }
};

export const getAllUsers = async (ctx: any, next: Function) => {
    try {
        let response = await User.find({});
        ctx.status = 200;
        ctx.body = response;
    } catch (err) {
        ctx.throw(err.status || 500, err.message || 'Internal error, cannot fetch users');
    }
};