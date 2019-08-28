import cors from '@koa/cors';
import cookies from 'cookies';
import mongoose from 'mongoose';

interface Config {
    isProduction: boolean;
    node: {
        port: string | number;
    };
    cookie: cookies.SetOption;
    cors: cors.Options;
    mongo: {
        url: string;
        options: mongoose.ConnectionOptions,
    };
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
    mongo: {
        url: `mongodb://${process.env.MONGO_DB}`,
        options: {
            useNewUrlParser: true,
            autoReconnect: true,
            useFindAndModify: false,
            useCreateIndex: true,
        },
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