import Redis, {ScanStreamOption} from 'ioredis';

export class RedisClient {
    private readonly url: string;
    private readonly name: string;
    client!: Redis.Redis;

    constructor({url, name}: { url: string, name: string }) {
        this.url = url;
        this.name = name;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.client = new Redis(this.url);

            console.log(`Connecting to ${this.name}...`);

            this.client.on('error', e => {
                reject(e);
            });

            this.client.on('ready', async () => {
                await this.onConnected();
                console.log(`Connected to ${this.name}!\n`);
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