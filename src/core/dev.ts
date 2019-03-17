import fs from 'fs';
import path from 'path';

import User, {IUser} from '../models/user';
import Entity, {IEntity} from '../models/entity';
import Category, {ICategory} from "../models/category";
import Meeting, {IMeeting} from "../models/meeting";

export const init = (): void => {
    loadDbSeed().then().catch(e => {
        console.log(e);
    })
};

const loadDbSeed = async () => {
    let users: IUser[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/users.json'), 'utf8'));
    let entities: IEntity[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/entities.json'), 'utf8'));
    let categories: ICategory[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/categories.json'), 'utf8'));
    let meetings: IMeeting[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/meetings.json'), 'utf-8'));

    await User.deleteMany({});
    await User.insertMany(users);

    await Category.deleteMany({});
    await Category.insertMany(categories);

    await Entity.deleteMany({});
    await Entity.insertMany(entities);

    await Meeting.deleteMany({});
    await Meeting.insertMany(meetings);
};