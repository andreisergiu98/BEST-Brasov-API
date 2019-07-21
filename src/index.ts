import Koa from 'koa';
import logger from 'koa-logger';
import cors from '@koa/cors';
import bodyparser from 'koa-bodyparser';

import {catchError, logError} from './middlewares/error';

import {config} from './lib/config';
import {db} from './lib/db';
import {sessionStorage} from './lib/session-storage';
import {dev} from './lib/dev';

import {routes} from './routes';

class App {
    app: Koa;

    constructor() {
        this.app = new Koa();
    }

    async init() {
        await db.connect(config.mongo.url);

        await sessionStorage.connect(config.redis.url);

        this.app.use(logger());

        this.app.use(catchError);
        this.app.on('error', logError);

        this.app.use(bodyparser());

        this.app.use(cors(config.cors));

        this.app.use(routes);

        if (!config.isProduction) {
            await dev.init();
        }

        this.app.listen(config.node.port);
        console.log(`Server is running on port ${config.node.port}`);
    }
}

const app = new App();

app.init().then().catch(e => console.log(e.message));