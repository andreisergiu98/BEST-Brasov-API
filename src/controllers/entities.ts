import Koa from 'koa';

import {Controller, mountQueryToState} from '../lib/controller';

import {EntityCategory, EntityCategoryModel} from '../models/entity-category';
import {UserModel} from '../models/user';
import {Comment, EntityModel} from '../models/entity';

export class EntitiesController extends Controller {
    @mountQueryToState()
    async getAll(ctx: Koa.Context) {
        const {query} = ctx.state;
        ctx.body = await EntityModel.find(query.conditions).populate(query.populate).select(query.fields).lean();
        ctx.status = 200;
    }

    @mountQueryToState()
    async getById(ctx: Koa.Context) {
        if (!this.isObjectIdValid(ctx.params.id)) {
            ctx.throw(404);
        }

        const {query} = ctx.state;
        const entity = await EntityModel.findById(ctx.params.id).populate(query.populate).select(query.fields).lean();

        if (!entity) {
            ctx.throw(404);
        }

        ctx.status = 200;
        ctx.body = entity;
    }

    @mountQueryToState()
    async getCategories(ctx: Koa.Context) {
        const {query} = ctx.state;
        ctx.body = await EntityCategoryModel.find(query.conditions).select(query.fields).lean();
        ctx.status = 200;
    }

    async createOne(ctx: Koa.Context) {
        const data = ctx.request.body;

        data._id = null;
        data.categories = await this.updateCategories(data.categories);

        const entity = await EntityModel.insertMany([data]);
        ctx.status = 201;
        ctx.body = entity[0];
    }

    async updateOne(ctx: Koa.Context) {
        const data = ctx.request.body;

        if (!this.isObjectIdValid(data._id)) {
            ctx.throw(400);
        }

        data.categories = await this.updateCategories(data.categories);

        const entity = await EntityModel.findByIdAndUpdate(data._id, data);
        if (!entity) {
            ctx.throw(404);
        }

        ctx.body = entity;
        ctx.status = 200;
    }

    async addComment(ctx: Koa.Context) {
        const data = ctx.request.body as { _id: string, comment: Comment };

        if (!this.isObjectIdValid(data._id)) {
            ctx.throw(404);
            return;
        }

        const entity = await EntityModel.findById(data._id);

        if (!entity) {
            ctx.throw(404);
            return;
        }

        const user = await UserModel.findById(ctx.state.user.id);
        if (!user) {
            throw new Error(`Cannot find user ${ctx.state.user.id}, by session!`);
        }

        entity.comments.push({text: data.comment.text, date: new Date(), user});
        await entity.save();

        ctx.body = {...data.comment, user: {name: user.name, photo: user.photo}};
        ctx.status = 200;
    }

    private async updateCategories(categories: EntityCategory[]) {
        const existingCategories = [];
        for (const category of categories) {
            if (this.isObjectIdValid(category._id)) {
                existingCategories.push(category._id);
            } else {
                const newCategory = await EntityCategoryModel.insertMany([{name: category.name}]);
                existingCategories.push(newCategory[0]._id);
            }
        }
        return existingCategories;
    }
}

