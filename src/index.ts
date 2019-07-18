import Koa from 'koa';
import logger from 'koa-logger';
import bodyparser from 'koa-bodyparser';
import cors from '@koa/cors';

import {catchError, logError} from './middlewares/error';
import {db} from './lib/db';
import {routes} from './routes';

import * as dev from './lib/dev';

class App {
    app: Koa;

    constructor() {
        this.app = new Koa();
    }

    init() {
        db.connect(`mongodb://${process.env.MONGO_DB}`);

        this.app.use(logger());

        this.app.use(catchError);
        this.app.on('error', logError);

        this.app.use(bodyparser());

        this.app.use(cors());

        this.app.use(routes);

        this.app.listen(process.env.PORT);
        console.log(`Server is running on port ${process.env.PORT}`);

        if (process.env.NODE_ENV === 'development') {
            dev.init();
        }
    }
}

const app = new App();
app.init();
