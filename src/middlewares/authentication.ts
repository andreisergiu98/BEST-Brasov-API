import Koa from 'koa';
import jwt from 'jsonwebtoken';

export const authentication = async (ctx: Koa.Context, next: Function) => {
    const token = ctx.get('authorization');
    const signKey = process.env.JWT_SIGN_KEY;

    if (!signKey) {
        ctx.throw('No JWT sign key!');
        return;
    }

    if (!token) {
        ctx.throw(401);
    }

    await jwt.verify(token, signKey, (err, decoded) => {
        if (err) {
            ctx.throw(401);
        } else {
            ctx.state.user = decoded;
            return next();
        }
    });
};