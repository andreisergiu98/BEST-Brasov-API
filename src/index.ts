import Koa from 'koa';
import logger from 'koa-logger';
import cors from '@koa/cors';
import bodyparser from 'koa-bodyparser';

import {catchError, logError} from './middlewares/error';

import {db} from './lib/db';
import {sessionStorage} from './lib/session-storage';

import {config} from './config';
import {routes} from './routes';

class App {
    app: Koa;

    constructor() {
        this.app = new Koa();
    }

    async init() {
        await sessionStorage.connect();

        await db.connect();

        this.app.use(logger());

        this.app.use(catchError);
        this.app.on('error', logError);

        this.app.use(bodyparser());

        this.app.use(cors(config.cors));

        this.app.use(routes);

        this.app.listen(config.node.port);

        console.log(`Server is running on port ${config.node.port}\n`);
    }
}

const app = new App();

app.init().then().catch(e => console.log(e.message));