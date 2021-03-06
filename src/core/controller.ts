/* tslint:disable:no-any */
import Koa from 'koa';
import Router from 'koa-router-find-my-way';

import {db} from './db';
import {RBAC, Role} from './rbac';

import {initArray} from '../utils/db';
import {object} from '../utils/object';

interface ParsedQuery {
    populate?: string | string[];
    fields?: string | string[];
    conditions?: object;
    limit?: string;
    offset?: string;
}

type Hook = (ctx: Koa.Context) => Promise<void>;

interface MethodOptions {
    middlewares?: Koa.Middleware | Koa.Middleware[];
    preHooks?: Hook | Hook[];
    postHooks?: Hook | Hook[];
    access?: Role;
    disabled?: boolean;
}

interface ReadOptions extends MethodOptions {
    excludeFields?: string[];
}

export interface ControllerOptions {
    read?: ReadOptions;
    create?: MethodOptions;
    update?: MethodOptions;
    delete?: MethodOptions;
}

export class Controller<T> {
    private readonly router = Router();
    // tslint:disable-next-line:variable-name
    private readonly Resource: new (x?: T) => T;
    private readonly options: ControllerOptions;
    private readonly excludedFields: string[] = [];
    private routesCreated = false;

    constructor(resource: new (x?: T) => T, options: ControllerOptions = {}) {
        this.Resource = resource;

        if (options.read && options.read.excludeFields) {
            this.excludedFields = options.read.excludeFields;
        }
        this.options = options;
    }

    private createRouter(options: ControllerOptions) {
        const beforeRead: Koa.Middleware[] = this.createMiddlewares(options.read);
        const beforeCreate: Koa.Middleware[] = this.createMiddlewares(options.create);
        const beforeUpdate: Koa.Middleware[] = this.createMiddlewares(options.update);
        const beforeDelete: Koa.Middleware[] = this.createMiddlewares(options.delete);

        if (!this.isDisabled(options.read)) {
            this.router.get('/:id', ...beforeRead, this.getById);
            this.router.get('/', ...beforeRead, this.getAll);
        }
        if (!this.isDisabled(options.create)) {
            this.router.post('/', ...beforeCreate, this.create);
        }
        if (!this.isDisabled(options.update)) {
            this.router.put('/:id', ...beforeUpdate, this.updateOne);
            this.router.put('/', ...beforeUpdate, this.updateMany);
        }
        if (!this.isDisabled(options.read)) {
            this.router.delete('/:id', ...beforeDelete, this.delete);
        }
    }

    protected extendRouter = (router: Router.Instance) => {

    };

    private createMiddlewares(options: MethodOptions = {}) {
        let middlewares: Koa.Middleware[] = [];
        if (options.access) {
            middlewares.push(RBAC.restrictAccess(options.access));
        }
        if (options.middlewares) {
            if (Array.isArray(options.middlewares)) {
                middlewares = middlewares.concat(options.middlewares);
            } else {
                middlewares.push(options.middlewares);
            }
        }
        return middlewares;
    }

    private async handleHooks(ctx: Koa.Context, hooks?: Hook | Hook[]) {
        if (!hooks) return;

        if (Array.isArray(hooks)) {
            for (const hook of hooks) {
                await hook(ctx);
            }
            return;
        }
        await hooks(ctx);
    }

    private isDisabled(options?: MethodOptions) {
        if (!options) {
            return false;
        }
        if (options.disabled === undefined) {
            return false;
        }
        return options.disabled;
    }

    get routes() {
        if (!this.routesCreated) {
            this.createRouter(this.options);
            this.extendRouter(this.router);
            this.routesCreated = true;
        }
        return this.router.routes();
    }

    protected getAll = async (ctx: Koa.Context) => {
        if (this.options.read) {
            await this.handleHooks(ctx, this.options.read.preHooks);
        }

        const query = parseDatabaseQuery(ctx.query, this.excludedFields);
        try {
            ctx.body = await db.manager.find(this.Resource, {
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

        if (this.options.read) {
            await this.handleHooks(ctx, this.options.read.postHooks);
        }
    };

    protected getById = async (ctx: Koa.Context) => {
        if (this.options.read) {
            await this.handleHooks(ctx, this.options.read.preHooks);
        }

        const id = Number(ctx.params.id);
        const query = parseDatabaseQuery(ctx.query, this.excludedFields);

        if (isNaN(id)) {
            ctx.throw(400, 'Invalid id');
            return;
        }

        let item;
        try {
            item = await db.manager.findOne(this.Resource, {
                where: {id: ctx.params.id},
                relations: query.populate,
                select: query.fields,
            });
        } catch (e) {
            ctx.throw(400, e.message);
        }

        if (!item) {
            ctx.throw(404);
        }

        ctx.body = item;
        ctx.status = 200;

        if (this.options.read) {
            await this.handleHooks(ctx, this.options.read.postHooks);
        }
    };

    protected create = async (ctx: Koa.Context) => {
        if (this.options.create) {
            await this.handleHooks(ctx, this.options.create.preHooks);
        }

        const body = ctx.request.body as any | undefined;

        if (!body) {
            ctx.throw(400, 'Payload is missing');
            return;
        }

        try {
            body.id = null;
            ctx.body = await db.manager.save(new this.Resource(body));
            ctx.status = 201;
        } catch (e) {
            ctx.throw(400, e.message);
        }

        if (this.options.create) {
            await this.handleHooks(ctx, this.options.create.postHooks);
        }
    };

    protected updateOne = async (ctx: Koa.Context) => {
        if (this.options.update) {
            await this.handleHooks(ctx, this.options.update.preHooks);
        }

        const id = Number(ctx.params.id);
        const body = ctx.request.body as any | undefined;

        if (isNaN(id)) {
            ctx.throw(400, 'Invalid id');
        }

        if (!body) {
            ctx.throw(400, 'Payload is missing');
            return;
        }

        try {
            body.id = id;
            ctx.body = await db.manager.save(new this.Resource(body));
            ctx.status = 200;
        } catch (e) {
            ctx.throw(400, e.message);
        }

        if (this.options.update) {
            await this.handleHooks(ctx, this.options.update.postHooks);
        }
    };

    protected updateMany = async (ctx: Koa.Context) => {
        if (this.options.update) {
            await this.handleHooks(ctx, this.options.update.preHooks);
        }

        const body = ctx.request.body as any | undefined;

        if (!body) {
            ctx.throw(400, 'Payload is missing');
            return;
        }

        if (!Array.isArray(body)) {
            ctx.throw(400, 'Payload is not an array!');
            return;
        }

        try {
            const items = initArray(this.Resource, body);
            ctx.body = await db.manager.save(items);
            ctx.status = 200;
        } catch (e) {
            ctx.throw(400, e.message);
        }

        if (this.options.update) {
            await this.handleHooks(ctx, this.options.update.postHooks);
        }
    };

    protected delete = async (ctx: Koa.Context) => {
        if (this.options.delete) {
            await this.handleHooks(ctx, this.options.delete.preHooks);
        }

        const id = Number(ctx.params.id);
        if (isNaN(id)) {
            ctx.throw(400, 'Invalid id');
        }

        const res = await db.manager.getRepository(this.Resource).delete(id);
        if (res.affected === 0) {
            ctx.throw(404);
        }
        ctx.status = 204;

        if (this.options.delete) {
            await this.handleHooks(ctx, this.options.delete.postHooks);
        }
    };
}

export function parseDatabaseQuery(query: ParsedQuery, excludedFields: string[] = []) {
    const validQuery = {
        // tslint:disable-next-line:no-any
        fields: undefined as any[] | undefined,
        conditions: {} as object,
        populate: undefined as string[] | undefined,
        limit: undefined as number | undefined,
        offset: undefined as number | undefined,
    };

    if (!query) {
        return validQuery;
    }

    if (query.populate) {
        if (Array.isArray(query.populate)) {
            validQuery.populate = [];
            for (const item of query.populate) {
                if (object.isString(item)) {
                    validQuery.populate.push(item);
                }
            }
        } else {
            if (object.isString(query.populate)) {
                validQuery.populate = [query.populate];
            }
        }
    }

    if (query.fields) {
        if (Array.isArray(query.fields)) {
            validQuery.fields = [];
            for (const item of query.fields) {
                if (object.isString(item) && !excludedFields.includes(item)) {
                    validQuery.fields.push(item);
                }
            }
        } else {
            if (object.isString(query.fields) && !excludedFields.includes(query.fields)) {
                validQuery.fields = [query.fields];
            }
        }
    }

    const limit = Number(query.limit);
    if (!isNaN(limit) && limit > 0) {
        validQuery.limit = limit;
    }

    const offset = Number(query.offset);
    if (!isNaN(offset) && offset > 0) {
        validQuery.offset = offset;
    }

    if (query.conditions && object.isPlainObject(query.conditions)) {
        validQuery.conditions = query.conditions;
    }

    return validQuery;
}