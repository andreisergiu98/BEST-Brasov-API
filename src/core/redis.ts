import Redis, {ScanStreamOption} from 'ioredis';
import {config} from '../config';

export class RedisClient {
    private readonly db!: number;
    client!: Redis.Redis;

    constructor(db: number) {
        this.db = db;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.client = new Redis(config.redis.url + '/' + this.db);

            console.log(`Connecting to redis:${this.db}...`);

            this.client.on('error', e => {
                reject(e);
            });

            this.client.on('ready', async () => {
                console.log(`Connected to redis:${this.db}!\n`);
                await this.onConnected();
                resolve();
            });
        });
    }

    protected async onConnected() {
    }

    async scanStream(options: ScanStreamOption): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const keys: string[] = [];
            const stream = this.client.scanStream(options);
            stream.on('data', resultKeys => {
                for (let i = 0; i < resultKeys.length; i++) {
                    keys.push(resultKeys[i]);
                }
            });
            stream.on('end', () => {
                resolve(keys);
            });
            stream.on('error', err => {
                reject(err);
            });
        });
    }
}