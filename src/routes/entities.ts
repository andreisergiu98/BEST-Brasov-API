import Koa from 'koa';
import mongoose from "mongoose";

import Entity from "../models/entity";
import Category from "../models/category";

export const getById = async (ctx: Koa.Context, next: Function) => {
    let response = await Entity.findById(ctx.params.id);
    if (response) {
        ctx.status = 200;
        ctx.body = response;
    } else {
        ctx.throw(404, 'Entity not found!');
    }

};

export const getAll = async (ctx: Koa.Context, next: Function) => {
    ctx.body = await Entity.find({});
    ctx.status = 200;
};

export const update = async (ctx: Koa.Context, next: Function) => {
    let data = ctx.request.body;

    let categories = [];
    for (let i = 0; i < data.categories.length; i++) {
        if (mongoose.Types.ObjectId.isValid(data.categories[i]._id)) {
            categories.push(data.categories[i]._id);
        } else {
            let res = await Category.insertMany([{name: data.categories[i].name}]);
            categories.push(res[0]._id);
        }
    }

    data.categories = categories;

    let res = await Entity.findById(data._id);
    if (res == null) {
        data._id = null;
        await Entity.insertMany([data]);
        ctx.status = 204;
    } else {
        await Entity.findByIdAndUpdate(data._id, data);
        ctx.status = 200;
    }
};