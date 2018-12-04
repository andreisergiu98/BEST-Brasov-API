import Koa from 'koa';
import logger from 'koa-logger';
import bodyparser from 'koa-bodyparser';

import db from './core/db';
import routes from './routes';

const port = 8081;
const mongoUrl = 'mongo:27017/dashboard';

class App {
    app: Koa;

    constructor() {
        db.connect(`mongodb://${mongoUrl}`);

        this.app = new Koa();

        this.app.use(logger());

        this.app.use(bodyparser());

        this.app.use(routes);

        this.app.listen(port);
        console.log(`Server is running on port ${port}`);
    }
}

export default new App();

