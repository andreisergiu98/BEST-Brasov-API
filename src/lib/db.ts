import mongoose from 'mongoose';

class Db {
    connection = mongoose.connection;

    async connect(url: string) {
        return new Promise((resolve, reject) => {
            mongoose.set('useCreateIndex', true);

            const db = this.connection;

            const config = {
                useNewUrlParser: true,
                autoReconnect: true,
                useFindAndModify: false,
            };

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
                    mongoose.connect(url, config);
                }, 2000);
            });

            mongoose.connect(url, config);
        });
    }
}

export const db = new Db();
