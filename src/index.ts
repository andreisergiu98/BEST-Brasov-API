import Koa from 'koa';
import mongoose from 'mongoose';

const port = 8081;
const mongoUrl = 'mongo:27017/dashboard';

class App {
    app: Koa;

    constructor() {
        mongoose.connect(`mongodb://${mongoUrl}`, {
            useNewUrlParser: true
        }).then(() => {
            console.log('Succesfuly connected to the database')
        }).catch(e => {
            console.log('Couldn\'t connect to the database: ' + e);
        })

        this.app = new Koa();

        this.app.use(async (ctx, next) => {
            await next();
            const rt = ctx.response.get('X-Response-Time');
            console.log(`${ctx.method} ${ctx.url} - ${rt}`);
        });

        this.app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
          });

        this.app.listen(port);
        console.log(`Server is running on port ${port}`);
    }
}

export default new App();

