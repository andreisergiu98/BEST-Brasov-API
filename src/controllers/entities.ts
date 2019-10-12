import Koa from 'koa';

import {Controller} from '../core/controller';
import {db} from '../core/db';

import {EntityCategory} from '../models/entity-category';
import {Entity} from '../models/entity';

export class EntitiesController extends Controller {
    async getAll(ctx: Koa.Context) {
        const dbQuery = this.getDatabaseQuery(ctx.query);
        try {
            ctx.body = await db.manager.find(Entity, {
                where: dbQuery.conditions,
                relations: dbQuery.populate,
                select: dbQuery.fields,
                skip: dbQuery.offset,
                take: dbQuery.limit,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.status = 200;
    }

    async getById(ctx: Koa.Context) {
        const dbQuery = this.getDatabaseQuery(ctx.query);
        let entity;
        try {
            entity = await db.manager.findOne(Entity, {
                where: {id: ctx.params.id},
                relations: dbQuery.populate,
                select: dbQuery.fields,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }

        if (!entity) {
            ctx.throw(404);
        }

        ctx.body = entity;
        ctx.status = 200;
    }

    async getCategories(ctx: Koa.Context) {
        const dbQuery = this.getDatabaseQuery(ctx.query);
        try {
            ctx.body = await db.manager.find(EntityCategory, {
                where: dbQuery.conditions,
                relations: dbQuery.populate,
                select: dbQuery.fields,
                skip: dbQuery.offset,
                take: dbQuery.limit,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.status = 200;
    }

    async createOne(ctx: Koa.Context) {
        const data = ctx.request.body as Entity | undefined;

        if (!data) {
            ctx.throw(400);
            return;
        }

        try {
            data.id = NaN;
            ctx.body = await db.manager.save(new Entity(data));
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.status = 201;
    }

    async updateOne(ctx: Koa.Context) {
        const data = ctx.request.body as Entity | undefined;

        if (!data) {
            ctx.throw(400);
            return;
        }

        if (await db.manager.count(Entity, {id: data.id}) === 0) {
            ctx.throw(404);
        }
        try {
            ctx.body = await db.manager.save(new Entity(data));
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.status = 200;
    }
}

