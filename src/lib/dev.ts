import fs from 'fs';
import path from 'path';

import {UserModel, User} from '../models/user';
import {EntityModel, Entity} from '../models/entity';
import {EntityCategoryModel, EntityCategory} from '../models/entity-category';
import {MeetingModel, Meeting} from '../models/meeting';
// import {CallingSession, CallingSessionType} from '../models/calling-session';
// import {Event, EventType} from '../models/event';

export const init = async () => {
    await loadDbSeed();
};

const loadDbSeed = async () => {
    const users: User[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/users.json'), 'utf8'));
    const entities: Entity[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/entities.json'), 'utf8'));
    const categories: EntityCategory[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/categories.json'), 'utf8'));
    const meetings: Meeting[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/meetings.json'), 'utf8'));
    // const events: EventType[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/events.json'), 'utf8'));
    // const callingSessions: CallingSessionType[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/calling-sessions.json'), 'utf8'));

    await UserModel.deleteMany({});
    await UserModel.insertMany(users);

    await EntityCategoryModel.deleteMany({});
    await EntityCategoryModel.insertMany(categories);

    await EntityModel.deleteMany({});
    await EntityModel.insertMany(entities);

    await MeetingModel.deleteMany({});
    await MeetingModel.insertMany(meetings);

    // await Event.deleteMany({});
    // await Event.insertMany(events);

    // await CallingSession.deleteMany({});
    // await CallingSession.insertMany(callingSessions);
};