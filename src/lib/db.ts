import mongoose from 'mongoose';
import {config} from '../config';

class Db {
    connection = mongoose.connection;

    async connect(url: string) {
        return new Promise((resolve, reject) => {
            const db = this.connection;

            db.on('connecting', () => {
                console.log('Connecting to Mongo...');
            });

            db.on('error', (error) => {
                console.error(`Error in Mongo connection: ${error}`);
                mongoose.disconnect();
                reject();
            });

            db.on('connected', () => {
                console.log('Mongo connected!');
            });

            db.once('open', () => {
                console.log('Mongo connection is ready!\n');
                resolve();
            });

            db.on('reconnected', () => {
                console.log('Mongo reconnected!');
            });

            db.on('disconnected', () => {
                console.log('Mongo disconnected!');

                // Wait 2 seconds and try to reconnect to the database
                setTimeout(() => {
                    mongoose.connect(url, config.mongo.options);
                }, 2000);
            });

            mongoose.connect(url, config.mongo.options);
        });
    }
}

export const db = new Db();
