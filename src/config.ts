import cors from '@koa/cors';
import cookies from 'cookies';
import typeorm from 'typeorm';

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
    isProduction,
    cors: {
        credentials: true,
        origin: ctx => ctx.request.header.origin,
    } as cors.Options,
    cookie: {
        secure: isProduction,
        httpOnly: true,
    } as cookies.SetOption,
    postgres: {
        name: 'main_db',
        type: 'postgres',
        url: process.env.POSTGRES,
        synchronize: !isProduction,
        logging: false,
        entities: [`${__dirname}/models/*.${isProduction ? 'js' : 'ts'}`],
    } as typeorm.ConnectionOptions,
    redis: {
        url: `redis://${process.env.REDIS}`,
        databases: {
            sessionStorage: 0,
        },
    },
    node: {
        port: process.env.PORT || 8081,
    },
};