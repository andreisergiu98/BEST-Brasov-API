import cors from '@koa/cors';
import cookies from 'cookies';
import typeorm from 'typeorm';

import {time} from './utils/time';

const isProduction: boolean = process.env.NODE_ENV === 'production';

export const config = {
    isProduction,
    cors: {
        credentials: true,
        origin: ctx => ctx.request.header.origin,
    } as cors.Options,
    auth: {
        cookieKey: 'auth',
        maxAge: time.daysToMilliseconds(7),
        cookieOptions: {
            secure: isProduction,
            httpOnly: true,
            overwrite: true,
            maxAge: time.daysToMilliseconds(7),
        } as cookies.SetOption,
    },
    postgres: {
        name: 'postgres',
        type: 'postgres',
        url: process.env.POSTGRES,
        synchronize: !isProduction,
        logging: false,
        entities: [`${__dirname}/models/*.${isProduction ? 'js' : 'ts'}`],
    } as typeorm.ConnectionOptions,
    redis: {
        url: process.env.REDIS,
        databases: {
            sessionStorage: 0,
        },
    },
    node: {
        port: process.env.PORT || 8081,
    },
};