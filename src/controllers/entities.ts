import Koa from 'koa';

import {Controller, action} from '../lib/controller';

import {EntityCategoryModel, EntityCategory} from '../models/entity-category';
import {UserModel} from '../models/user';
import {Comment, EntityModel} from '../models/entity';

export class EntitiesController extends Controller {
    constructor() {
        super();

        this.autoPopulate = ['categories'];
    }

    @action()
    async getAll(ctx: Koa.Context) {
        const {query} = ctx.state;
        const populate = this.mergeWithAutoPopulate(query.populate);
        const conditions = query.conditions;

        ctx.body = await EntityModel.find(conditions).populate(populate).lean();
        ctx.status = 200;
    }

    @action()
    async getById(ctx: Koa.Context) {
        if (!this.isObjectIdValid(ctx.params.id)) {
            ctx.throw(404);
        }

        const {query} = ctx.state;
        const populate = this.mergeWithAutoPopulate(query.populate);

        const entity = await EntityModel.findById(ctx.params.id).populate(populate).lean();

        if (entity) {
            ctx.status = 200;
            ctx.body = entity;
        } else {
            ctx.throw(404);
        }
    }

    @action()
    async updateOne(ctx: Koa.Context) {
        const data = ctx.request.body;
        data.categories = await this.updateCategories(data.categories);

        if (!this.isObjectIdValid(data._id)) {
            ctx.throw(400);
        }

        const entity = await EntityModel.findByIdAndUpdate(data._id, data);

        if (entity) {
            ctx.status = 200;
            ctx.body = entity;
        } else {
            ctx.throw(400);
        }
    }

    @action({parseQuery: false})
    async createOne(ctx: Koa.Context) {
        const data = ctx.request.body;

        data.categories = await this.updateCategories(data.categories);
        data._id = null;

        const entity = await EntityModel.insertMany([data]);
        ctx.status = 201;
        ctx.body = entity[0];
    }

    @action({parseQuery: false})
    async getCategories(ctx: Koa.Context) {
        ctx.body = await EntityCategoryModel.find({});
        ctx.status = 200;
    }

    @action({parseQuery: false})
    async addComment(ctx: Koa.Context) {
        const data = ctx.request.body as { _id: string, comment: Comment };

        if (!this.isObjectIdValid(data._id)) {
            ctx.throw(404);
            return;
        }

        const entity = await EntityModel.findById(data._id);
        if (entity == null) {
            ctx.throw(404);
            return;
        }

        if (!this.isObjectIdValid(data.comment.user)) {
            ctx.throw(400);
        }

        const user = await UserModel.findById(data.comment.user);
        if (user == null) {
            ctx.throw(400);
            return;
        }

        entity.comments.push({text: data.comment.text, date: new Date(), user});
        await entity.save();

        ctx.body = entity.comments[0];
        ctx.status = 200;
    }

    updateCategories = async (categories: EntityCategory[]) => {
        const existingCategories = [];

        for (let i = 0; i < categories.length; i++) {
            if (this.isObjectIdValid(categories[i]._id)) {
                existingCategories.push(categories[i]._id);
            } else {
                const category = await EntityCategoryModel.insertMany([{name: categories[i].name}]);
                existingCategories.push(category[0]._id);
            }
        }

        return existingCategories;
    };
}

