import fs from 'fs';
import path from 'path';

import User, {IUser} from '../models/user';
import Entity, {IEntity} from '../models/entity';
import Category, {ICategory} from "../models/category";

export const init = (): void => {
    loadDbSeed().then().catch(e => {
        console.log(e);
    })
};

const loadDbSeed = async () => {
    let users: IUser[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/users.json'), 'utf8'));
    let entities: IEntity[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/entities.json'), 'utf8'));
    let categories: ICategory[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/categories.json'), 'utf8'));

    await User.deleteMany({});
    await User.insertMany(users);

    await Category.deleteMany({});
    await Category.insertMany(categories);

    for (let i = 0; i < entities.length; i++) {
        let categories: string[] = [];

        for (let j = 0; j < (entities[i].categories || []).length; j++) {
            // @ts-ignore
            let res = await Category.findOne({name: entities[i].categories[j]});
            if (res != null)
                categories.push(res._id);
        }

        // @ts-ignore
        entities[i].categories = categories;
    }

    await Entity.deleteMany({});
    await Entity.insertMany(entities);
};