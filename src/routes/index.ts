import Router from 'koa-router';

import * as users from './users';
import * as entities from './entities';
import * as categories from './categories';

const router: Router = new Router();

// User requests
router.get('/user/:id', users.getById);
router.get('/users', users.getAll);

// Entity requests
router.get('/entity/:id', entities.getById);
router.get('/entities', entities.getAll);


//Category requests
router.get('/entity-categories', categories.getAll);

export default router.routes();