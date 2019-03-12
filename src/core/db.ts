import mongoose from 'mongoose';

class Db {
    static connection = mongoose.connection;

    static connect(url: string): void {
        mongoose.set('useCreateIndex', true);

        let db = Db.connection;

        const config = {
            useNewUrlParser: true,
            autoReconnect: true,
            useFindAndModify: false
        };

        db.on('connecting', function () {
            console.log('Connecting to Mongo...');
        });

        db.on('error', function (error) {
            console.error(`Error in Mongo connection: ${error}`);
            mongoose.disconnect();
        });

        db.on('connected', function () {
            console.log('Mongo connected!');
        });

        db.once('open', function () {
            console.log('Mongo connection opened!');
        });

        db.on('reconnected', function () {
            console.log('Mongo reconnected!');
        });

        db.on('disconnected', function () {
            console.log('Mongo disconnected!');

            // Wait 2 seconds and try to reconnect to the database
            setTimeout(() => {
                mongoose.connect(url, config);
            }, 2000);
        });

        mongoose.connect(url, config);
    }
}

export default Db;