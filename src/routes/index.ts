import Router from 'koa-router';
const router: Router = new Router();

import * as tests from './tests'

router.get('/getTest', tests.getTest);

router.post('/postTest', tests.postTest);

export default router.routes();