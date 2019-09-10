import {createConnection, getConnection} from 'typeorm';

import {config} from '../config';

class Db {
    private connectionName = config.postgres.name;

    async connect() {
        console.log(`Connecting to ${this.connectionName}...`);
        await createConnection(config.postgres);
        console.log(`Connected to ${this.connectionName}!\n`);
    }

    getConnection() {
        return getConnection(this.connectionName);
    }

    getManager() {
        return getConnection(this.connectionName).manager;
    }
}

export const db = new Db();