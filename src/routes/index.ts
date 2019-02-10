import Router from 'koa-router';

import * as user from './user';
import * as entity from './entity';

const router: Router = new Router();

// User requests
router.get('/user/:id', user.getById);
router.get('/users', user.getAllUsers);

// Entity requests
router.get('/entity/:id', entity.getById);
router.get('/entities', entity.getAllEntities);

export default router.routes();