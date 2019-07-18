import Koa from 'koa';

export const catchError = async (ctx: Koa.Context, next: Function) => {
    try {
        await next();
    } catch (e) {
        ctx.status = e.status || 500;

        if (ctx.status === 500) {
            ctx.body = 'There was an error on the server, please report this to the coordinator!';
            ctx.app.emit('error', e, ctx);
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(e.message);
        }

        ctx.body = e.message;
    }
};

export const logError = (err: Error) => {
    console.log(err);
};
