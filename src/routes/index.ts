import Router from 'koa-router';

import * as users from './users';
import * as entities from './entities';
import * as meetings from './meetings';

const router: Router = new Router();

// User requests
router.get('/users/:id', users.getById);
router.get('/users', users.getAll);

// Entity requests
router.get('/entities/:id', entities.getById);
router.get('/entities', entities.getAll);
router.put('/entities/update', entities.update);
router.post('/entities/create', entities.create);
router.get('/entities/categories', entities.getCategories);


//Meetings requests
router.get('/meetings', meetings.getAll);

export default router.routes();