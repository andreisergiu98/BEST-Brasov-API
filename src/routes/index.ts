import Router from 'koa-router';

import * as users from './users';
import * as entities from './entities';
import * as meetings from './meetings';
import * as events from './events';
import * as callingSessions from './callings-sessions';

const router: Router = new Router();

// User requests
router.get('/users', users.getAll);
router.get('/users/:id', users.getById);

// Entity requests
router.get('/entities', entities.getAll);
router.get('/entities/categories', entities.getCategories);
router.post('/entities/comments', entities.addComment);
router.get('/entities/:id', entities.getById);
router.put('/entities', entities.update);
router.post('/entities', entities.create);

// Meetings requests
router.get('/meetings', meetings.getAll);

// Events requests
router.get('/events', events.getAll);
router.get('/events/:id', events.getById);

// Calling Sessions requests
router.get('/calling-sessions', callingSessions.getAll);
router.get('/calling-sessions/:id', callingSessions.getById);

export default router.routes();