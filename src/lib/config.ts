import * as cors from '@koa/cors';
import * as Cookies from 'cookies';

interface Config {
    isProduction: boolean;
    node: {
        port: string | number;
    };
    cookie: Cookies.SetOption;
    cors: cors.Options;
    mongo: {
        url: string;
    };
    redis: {
        url: string;
        sessionStorageDb: number;
    };
}

const isProduction = process.env.NODE_ENV === 'production';

export const config: Config = {
    isProduction,
    cors: {
        credentials: true,
        origin: ctx => ctx.request.header.origin,
    },
    cookie: {
        secure: isProduction,
        httpOnly: true,
    },
    mongo: {
        url: `mongodb://${process.env.MONGO_DB}`,
    },
    redis: {
        url: `redis://${process.env.REDIS}`,
        sessionStorageDb: 0,
    },
    node: {
        port: process.env.PORT || 8081,
    },
};