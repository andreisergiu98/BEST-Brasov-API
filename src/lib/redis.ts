import Redis from 'ioredis';

export class RedisClient {
    private readonly db!: number;
    client!: Redis.Redis;

    constructor(db: number) {
        this.db = db;
    }

    async connect(url: string) {
        return new Promise((resolve, reject) => {
            this.client = new Redis(url + '/' + this.db);

            console.log(`Connecting to Redis-${this.db}...`);

            this.client.on('error', e => {
                reject(e);
            });

            this.client.on('ready', () => {
                console.log(`Redis-${this.db} connection is ready!\n`);
                resolve();
            });

        });
    }
}