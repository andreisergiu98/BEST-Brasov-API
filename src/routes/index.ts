import Koa from 'koa';
import mount from 'koa-mount';

import {authentication} from '../middlewares/authentication';

import {UsersController} from '../controllers/users';
import {EntitiesController} from '../controllers/entities';
import {MeetingsController} from '../controllers/meetings';
import {CommentsController} from '../controllers/comments';

const app = new Koa();

const users = new UsersController();
const entities = new EntitiesController();
const meetings = new MeetingsController();
const comments = new CommentsController();

app.use(authentication);

app.use(mount('/users', users.routes));
app.use(mount('/entities', entities.routes));
app.use(mount('/entities/categories', entities.categories.routes));
app.use(mount('/meetings', meetings.routes));
app.use(mount('/comments', comments.routes));

export const routes = mount(app);
