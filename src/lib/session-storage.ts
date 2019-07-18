import redis, {RedisClient} from 'redis';

class SessionStorage {
    constructor(dbNumber: number) {
        this.db = dbNumber;
    }

    async connect(url: string) {
        return new Promise((resolve, reject) => {
            this.client = redis.createClient(url + '/' + this.db);

            console.log(`Connecting to Redis-${this.db}...`);

            this.client.on('error', e => {
                console.log('Redis error: ' + e);
                reject();
            });

            this.client.on('ready', () => {
                console.log(`Redis-${this.db} connection is ready!`);
                resolve();
            });

        });
    }

    private readonly db!: number;
    private client!: RedisClient;

    createSession() {

    }

    getSession() {

    }

    deleteSession() {

    }

    deleteAllSessions() {

    }

    reset() {

    }
}

export const sessionStorage = new SessionStorage(0);