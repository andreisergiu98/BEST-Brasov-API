import cors from '@koa/cors';
import cookies from 'cookies';
import {ConnectionOptions} from 'typeorm';

interface Config {
    isProduction: boolean;
    node: {
        port: string | number;
    };
    cookie: cookies.SetOption;
    cors: cors.Options;
    postgres: ConnectionOptions;
    redis: {
        url: string;
        databases: {
            sessionStorage: number
        };
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
    postgres: {
        name: 'main_db',
        type: 'postgres',
        url: process.env.POSTGRES_DB,
        synchronize: !isProduction,
        logging: false,
        entities: [__dirname + '/models/*{.ts, .js}',],
    },
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