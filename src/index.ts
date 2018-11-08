import Koa from 'koa';

class App {
    app: Koa;
    
    constructor() {
        this.app = new Koa();

        this.app.use(async ctx => {
            ctx.body = 'Hello World';
        });

        this.app.listen(8081);
    }
}

export default new App();

