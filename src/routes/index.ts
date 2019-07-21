import Router from 'koa-router';

import {RBAC} from '../lib/rbac';
import {authentication} from '../middlewares/authentication';

// import * as events from './events';
// import * as callingSessions from './calling-sessions';
import {UsersController} from '../controllers/users';
import {EntitiesController} from '../controllers/entities';
import {MeetingsController} from '../controllers/meetings';

const router: Router = new Router();

const users = new UsersController();
const entities = new EntitiesController();
const meetings = new MeetingsController();

// middlewares
router.use(authentication);

// authentication
router.get('/authentication', users.authenticate.bind(users));
router.post('/authentication', users.login.bind(users));

// User requests
router.get('/users', users.getAll.bind(users));
router.get('/users/:id', users.getById.bind(users));

// Entity requests
router.get('/entities', entities.getAll.bind(entities));
router.get('/entities/categories', entities.getCategories.bind(entities));
router.get('/entities/:id', entities.getById.bind(entities));
router.put('/entities', RBAC.restrictAccess(RBAC.roles.user), entities.updateOne.bind(entities));
router.post('/entities', RBAC.restrictAccess(RBAC.roles.user), entities.createOne.bind(entities));
router.post('/entities/comments', RBAC.restrictAccess(RBAC.roles.user), entities.addComment.bind(entities));

// Meetings requests
router.get('/meetings', meetings.getAll.bind(meetings));

// Events requests
// router.get('/events', events.getAll);
// router.get('/events/:id', events.getById);

// Calling Sessions requests
// router.get('/calling-sessions', callingSessions.getAll);
// router.get('/calling-sessions/:id', callingSessions.getById);

export const routes = router.routes();