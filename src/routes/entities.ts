import Koa from 'koa';
import mongoose from "mongoose";

import Entity from "../models/entity";
import EntityCategory from "../models/entityCategory";

export const getAll = async (ctx: Koa.Context, next: Function) => {
    ctx.body = await Entity.find({});
    ctx.status = 200;
};

export const getById = async (ctx: Koa.Context, next: Function) => {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.throw(404);
    }

    let response = await Entity.findById(ctx.params.id);
    if (response) {
        ctx.status = 200;
        ctx.body = response;
    } else {
        ctx.throw(404);
    }

};

export const update = async (ctx: Koa.Context, next: Function) => {
    let data = ctx.request.body;
    data.categories = await updateCategories(data.categories);

    if (!mongoose.Types.ObjectId.isValid(data._id)) {
        ctx.throw(404);
    }

    let res = await Entity.findById(data._id);
    if (res == null) {
        ctx.throw(404);
    }

    await Entity.findByIdAndUpdate(data._id, data);
    ctx.status = 200;
};

export const create = async (ctx: Koa.Context, next: Function) => {
    let data = ctx.request.body;
    data.categories = await updateCategories(data.categories);
    data._id = null;

    let res = await Entity.insertMany([data]);
    ctx.status = 201;
    ctx.body = {_id: res[0]._id};
};


export const getCategories = async (ctx: Koa.Context, next: Function) => {
    ctx.body = await EntityCategory.find({});
    ctx.status = 200;
};

const updateCategories = async (categories: any) => {
    let preprocessedCategories = [];
    for (let i = 0; i < categories.length; i++) {
        if (mongoose.Types.ObjectId.isValid(categories[i]._id)) {
            preprocessedCategories.push(categories[i]._id);
        } else {
            let res = await EntityCategory.insertMany([{name: categories[i].name}]);
            preprocessedCategories.push(res[0]._id);
        }
    }

    return preprocessedCategories;
};