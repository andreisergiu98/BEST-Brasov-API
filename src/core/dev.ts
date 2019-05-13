import fs from 'fs';
import path from 'path';

import Comment from '../models/comment';
import User, {IUser} from '../models/user';
import Entity, {IEntity} from '../models/entity';
import EntityCategory, {IEntityCategory} from '../models/entity-category';
import Meeting, {IMeeting} from '../models/meeting';
import CallingSession, {ICallingSession} from '../models/calling-session';
import Event, {IEvent} from '../models/event';

export const init = (): void => {
    loadDbSeed().then().catch(e => {
        console.log(e);
    });
};

const loadDbSeed = async () => {
    const users: IUser[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/users.json'), 'utf8'));
    const entities: IEntity[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/entities.json'), 'utf8'));
    const categories: IEntityCategory[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/categories.json'), 'utf8'));
    const meetings: IMeeting[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/meetings.json'), 'utf8'));
    const events: IEvent[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/events.json'), 'utf8'));
    const callingSessions: ICallingSession[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/calling-sessions.json'), 'utf8'));

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

    await Event.deleteMany({});
    await Event.insertMany(events);

    await CallingSession.deleteMany({});
    await CallingSession.insertMany(callingSessions);
};