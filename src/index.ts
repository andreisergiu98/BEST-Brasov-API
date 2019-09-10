import Koa from 'koa';
import cors from '@koa/cors';
import logger from 'koa-logger';
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

    private async initAsync() {
        await db.connect();

        await sessionStorage.connect();

        this.app.use(logger());

        this.app.use(catchError);
        this.app.on('error', logError);

        this.app.use(bodyparser());

        this.app.use(cors(config.cors));

        this.app.use(routes);

        this.app.listen(config.node.port);
    }

    init() {
        this.initAsync().then(() => {
            console.log(`Server is running on port ${config.node.port}\n`);
        }).catch((e) => {
            console.log(e.message);
        });
    }
}

const app = new App();
app.init();