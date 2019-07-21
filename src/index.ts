import Koa from 'koa';
import logger from 'koa-logger';
import cors from  '@koa/cors';
import bodyparser from 'koa-bodyparser';

import {catchError, logError} from './middlewares/error';

import {db} from './lib/db';
import {sessionStorage} from './lib/session-storage';
import * as dev from './lib/dev';

import {routes} from './routes';

class App {
    app: Koa;

    constructor() {
        this.app = new Koa();
    }

    async init() {
        await db.connect(`mongodb://${process.env.MONGO_DB}`);

        await sessionStorage.connect(`redis://${process.env.REDIS}`);

        this.app.use(logger());

        this.app.use(catchError);
        this.app.on('error', logError);

        this.app.use(bodyparser());

        this.app.use(cors());

        this.app.use(routes);

        if (process.env.NODE_ENV === 'development') {
            await dev.init();
        }

        this.app.listen(process.env.PORT);
        console.log(`Server is running on port ${process.env.PORT}`);
    }
}

const app = new App();

app.init().then().catch(e => console.log(e.message));