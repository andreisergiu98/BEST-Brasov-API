import Router from 'koa-router';

// import * as events from './events';
// import * as callingSessions from './calling-sessions';
import {UsersController} from '../controllers/users';
import {EntitiesController} from '../controllers/entities';
import {MeetingsController} from '../controllers/meetings';

const router: Router = new Router();

const users = new UsersController();
const entities = new EntitiesController();
const meetings = new MeetingsController();

// userModel requests
router.get('/users', users.getAll);
router.get('/users/:id', users.getById);

// Entity requests
router.get('/entities', entities.getAll);
router.get('/entities/categories', entities.getCategories);
router.post('/entities/comments', entities.addComment);
router.get('/entities/:id', entities.getById);
router.put('/entities', entities.updateOne);
router.post('/entities', entities.createOne);

// Meetings requests
router.get('/meetings', meetings.getAll);

// Events requests
// router.get('/events', events.getAll);
// router.get('/events/:id', events.getById);

// Calling Sessions requests
// router.get('/calling-sessions', callingSessions.getAll);
// router.get('/calling-sessions/:id', callingSessions.getById);

export const routes = router.routes();