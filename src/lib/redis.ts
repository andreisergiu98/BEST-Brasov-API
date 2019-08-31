import Redis, {ScanStreamOption} from 'ioredis';

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

    calcTtl(timestamp: number) {
        const ttl = new Date(timestamp).getTime() - Date.now();
        return Math.floor(ttl / 1000);
    }
}