import Koa from 'koa';
import mount from 'koa-mount';

import {authentication} from '../middlewares/authentication';

import {UsersController} from '../controllers/users';
import {EntitiesController} from '../controllers/entities';
import {MeetingsController} from '../controllers/meetings';
import {CommentsController} from '../controllers/comments';

const router = new Koa();

const users = new UsersController();
const entities = new EntitiesController();
const meetings = new MeetingsController();
const comments = new CommentsController();

router.use(authentication);

router.use(mount('/users', users.routes));

router.use(mount('/entities/categories', entities.categories.routes));
router.use(mount('/entities', entities.routes));

router.use(mount('/meetings', meetings.routes));

router.use(mount('/comments', comments.routes));

export const routes = mount(router);
