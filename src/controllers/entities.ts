import Koa from 'koa';

import {Controller, mountQueryToState} from '../lib/controller';
import {db} from '../lib/db';

import {EntityCategory} from '../models/entity-category';
import {Entity} from '../models/entity';
import {Comment} from '../models/comment';

export class EntitiesController extends Controller {
    @mountQueryToState()
    async getAll(ctx: Koa.Context) {
        let entities;
        try {
            const {query} = ctx.state;

            entities = await db.getConnection().getRepository(Entity).find({
                where: query.conditions,
                relations: query.populate,
                select: query.fields,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.body = entities;
        ctx.status = 200;
    }

    @mountQueryToState()
    async getById(ctx: Koa.Context) {
        let entity;
        try {
            const {query} = ctx.state;

            entity = await db.getConnection().getRepository(Entity).findOne({
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

    @mountQueryToState()
    async getCategories(ctx: Koa.Context) {
        let categories;
        try {
            const {query} = ctx.state;
            categories = await db.getConnection().getRepository(EntityCategory).find({
                where: query.condition,
                relations: query.populate,
                select: query.fields,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }

        ctx.body = categories;
        ctx.status = 200;
    }

    async createOne(ctx: Koa.Context) {
        let entity;
        try {
            entity = await db.getConnection().manager.save(new Entity(ctx.request.body));
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.body = entity;
        ctx.status = 201;
    }

    async updateOne(ctx: Koa.Context) {
        if (await db.getConnection().getRepository(Entity).count({id: ctx.request.body.id}) === 0) {
            ctx.throw(400);
        }

        let entity;
        try {
            entity = await db.getConnection().manager.save(new Entity(ctx.request.body));
        } catch (e) {
            ctx.throw(400, e.message);
        }
        ctx.body = entity;
        ctx.status = 200;
    }

    async addComment(ctx: Koa.Context) {
        const data = ctx.request.body as { id: string, comment: Comment };

        const user = ctx.state.user;
        const entity = await db.getConnection().getRepository(Entity).findOne({
            where: {id: data.id},
        });

        if (!entity) {
            ctx.throw(404);
            return;
        }

        const comment = new Comment({
            text: data.comment.text,
            entityId: entity.id,
            userId: user.id,
            date: new Date(),
        });
        comment.user = user;

        await db.getConnection().manager.save(comment);

        ctx.body = comment;
        ctx.status = 200;
    }
}

