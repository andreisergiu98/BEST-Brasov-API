import Router from 'koa-router';

import {RBAC} from '../lib/rbac';
import {authentication} from '../middlewares/authentication';

import {UsersController} from '../controllers/users';
import {EntitiesController} from '../controllers/entities';
import {MeetingsController} from '../controllers/meetings';
import {CommentsController} from '../controllers/comments';

const router = new Router();

const users = new UsersController();
const entities = new EntitiesController();
const meetings = new MeetingsController();
const comments = new CommentsController();

// middlewares
router.use(authentication);

// authentication
router.get('/authentication', users.authenticate);
router.post('/authentication', users.login);

// User requests
router.get('/users', users.getAll);
router.get('/users/:id', users.getById);

// Entity requests
router.get('/entities', entities.getAll);
router.get('/entities/categories', entities.getCategories);
router.get('/entities/:id', entities.getById);
router.put('/entities', RBAC.restrictAccess(RBAC.roles.user), entities.updateOne);
router.post('/entities', RBAC.restrictAccess(RBAC.roles.user), entities.createOne);

// Meetings requests
router.get('/meetings', meetings.getAll);

// Comments requests
router.post('/comments', RBAC.restrictAccess(RBAC.roles.user), comments.create);

export const routes = router.routes();