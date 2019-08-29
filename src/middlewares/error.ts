import Koa from 'koa';

export const catchError = async (ctx: Koa.Context, next: Function) => {
    try {
        await next();
    } catch (e) {
        ctx.status = e.status || 500;

        if (ctx.status === 500) {
            ctx.app.emit('error', e, ctx);
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(e.message);
        }

        ctx.body = e.message;
    }
};

export const logError = (e: Error) => {
    console.log(e.message);
};
