import uuid from 'uuid/v4';
import {RedisClient} from './redis';
import {config} from './config';

interface SessionData {
    id: string;
    name: string;
    role: string;
    expires?: number;
}

class SessionStorage extends RedisClient {
    defaultExp = 7 * 24 * 60 * 60;
    private separator = '-';

    createSession(userId: string, data: SessionData, exp = this.defaultExp): Promise<string> {
        return new Promise((resolve, reject) => {
            const session = userId + this.separator + uuid();
            data.expires = Date.now() + exp * 1000;

            this.client.set(session, JSON.stringify(data), 'EX', exp)
                .then(() => resolve(session))
                .catch(e => reject(e));
        });
    }

    getSession(session: string): Promise<SessionData | undefined> {
        return new Promise((resolve, reject) => {
            this.client.get(session).then(res => {
                if (res) {
                    resolve(JSON.parse(res));
                } else {
                    resolve();
                }
            }).catch(e => reject(e));
        });
    }

    deleteSession(session: string) {
        return this.client.del(session);
    }

    deleteAllSessions(userId: string) {
        return new Promise((resolve, reject) => {
            const stream = this.client.scanStream({
                match: userId + this.separator + '*',
                count: 100,
            });

            const keys: string[] = [];

            stream.on('data', resultKeys => {
                for (let i = 0; i < resultKeys.length; i++) {
                    keys.push(resultKeys[i]);
                }
            });

            stream.on('end', () => {
                // tslint:disable-next-line:ban-ts-ignore
                // @ts-ignore
                this.client.unlink(keys).then(() => resolve()).catch(e => reject(e));
            });
        });
    }

    updateData(userId: string, data: SessionData) {
        return new Promise((resolve, reject) => {
            const stream = this.client.scanStream({
                match: userId + this.separator + '*',
                count: 100,
            });

            const keys: string[] = [];

            stream.on('data', resultKeys => {
                for (let i = 0; i < resultKeys.length; i++) {
                    keys.push(resultKeys[i]);
                }
            });

            const promises: Array<Promise<string>> = [];

            stream.on('end', () => {
                for (const key of keys) {
                    let ttl = this.defaultExp;

                    if (data.expires) {
                        ttl = new Date(data.expires).getTime() - Date.now();
                        ttl = Math.floor(ttl / 1000);
                    }

                    promises.push(this.client.set(key, JSON.stringify(data), 'EX', ttl));
                }

                Promise.all(promises).then(() => resolve()).catch(e => reject(e));
            });
        });
    }

    extendSession(session: string, data: SessionData, exp = this.defaultExp) {
        return new Promise((resolve, reject) => {
            data.expires = Date.now() + exp * 1000;

            this.client.set(session, JSON.stringify(data), 'EX', exp)
                .then(() => resolve(session))
                .catch(e => reject(e));
        });
    }
}

export const sessionStorage = new SessionStorage(config.redis.sessionStorageDb);