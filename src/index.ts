import Koa from 'koa';
import mongoose from 'mongoose';

const port = 8081;
const mongoUrl = 'mongo:27017/dashboard';

class App {
    app: Koa;

    constructor() {
        this.app = new Koa();

        this.app.use(async ctx => {
            ctx.body = 'Hello Docker!';
        });

        this.app.listen(port);
        console.log(`Server is running on port ${port}`);

        mongoose.connect(`mongodb://${mongoUrl}`, {
            useNewUrlParser: true
        }).then(() => {
            console.log('Succesfuly connected to the database')
        }).catch(e => {
            console.log('Couldn\'t connect to the database: ' + e);
        })
    }
}

export default new App();

