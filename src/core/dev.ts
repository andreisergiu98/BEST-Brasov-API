import User from '../models/user';
import Entity from '../models/entity';

import fs from 'fs';
import path from 'path';

export const init = () => {
    loadDbSeed()
};

const loadDbSeed = () => {
    let users = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/users.json'), 'utf8'));
    let entities = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../development/db/entities.json'), 'utf8'));

    User.deleteMany({}).then(res => {
        User.insertMany(users).then(res => {
            console.log('DB: Users inserted!');
        }).catch(e => {
            console.log(e)
        });
    });

    Entity.deleteMany({}).then(res => {
        Entity.insertMany(entities).then(res => {
            console.log('DB: Entities inserted!');
        }).catch(e => {
            console.log(e)
        });
    });
};