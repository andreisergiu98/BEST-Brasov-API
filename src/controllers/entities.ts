import Koa from 'koa';

import {Controller} from '../lib/controller';
import {db} from '../lib/db';

import {EntityCategory} from '../models/entity-category';
import {Entity} from '../models/entity';

export class EntitiesController extends Controller {
    async getAll(ctx: Koa.Context) {
        const query = this.parseQuery(ctx.query);
        try {
            ctx.body = await db.getManager().find(Entity, {
                where: query.conditions,
                relations: query.populate,
                select: query.fields,
                skip: query.offset,
                take: query.limit,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.status = 200;
    }

    async getById(ctx: Koa.Context) {
        const query = this.parseQuery(ctx.query);
        let entity;
        try {
            entity = await db.getManager().findOne(Entity, {
                where: {id: ctx.params.id},
                relations: query.populate,
                select: query.fields,
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
        const query = this.parseQuery(ctx.query);
        try {
            ctx.body = await db.getManager().find(EntityCategory, {
                where: query.conditions,
                relations: query.populate,
                select: query.fields,
                skip: query.offset,
                take: query.limit,
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
            ctx.body = await db.getManager().save(new Entity(data));
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

        if (await db.getManager().count(Entity, {id: data.id}) === 0) {
            ctx.throw(404);
        }
        try {
            ctx.body = await db.getManager().save(new Entity(data));
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.status = 200;
    }
}

