import Koa from 'koa';

export const catchError = async (ctx: Koa.Context, next: Function) => {
    try {
        await next();
    } catch (e) {
        ctx.status = e.status || 500;
        ctx.body = ctx.status === 500 ? 'There was an error on the server, please report this to the coordinator!' : e.message;
        ctx.app.emit('error', e, ctx);
    }
};

export const logError = (err: Error, ctx: Koa.Context) => {
    console.log(err);
};
