import fs from 'fs';
import path from 'path';

import Comment from "../models/comment";
import User, {IUser} from '../models/user';
import Entity, {IEntity} from '../models/entity';
import EntityCategory, {IEntityCategory} from "../models/entity-category";
import Meeting, {IMeeting} from "../models/meeting";
import CallingSession from "../models/calling-session";
import Event from "../models/event";

export const init = (): void => {
    loadDbSeed().then().catch(e => {
        console.log(e);
    })
};

const loadDbSeed = async () => {
    let users: IUser[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/users.json'), 'utf8'));
    let entities: IEntity[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/entities.json'), 'utf8'));
    let categories: IEntityCategory[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/categories.json'), 'utf8'));
    let meetings: IMeeting[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/meetings.json'), 'utf-8'));

    await User.deleteMany({});
    await User.insertMany(users);

    await Comment.deleteMany({});
    await Comment.insertMany([]);

    await EntityCategory.deleteMany({});
    await EntityCategory.insertMany(categories);

    await Entity.deleteMany({});
    await Entity.insertMany(entities);

    await Meeting.deleteMany({});
    await Meeting.insertMany(meetings);

    await CallingSession.deleteMany({});
    await CallingSession.insertMany([]);

    await Event.deleteMany({});
    await Event.insertMany([]);
};