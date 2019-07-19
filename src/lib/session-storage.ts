import uuid from 'uuid/v4';
import {RedisClient} from './redis';

class SessionStorage extends RedisClient {
    createSession(userId: string, data: {}, exp = 7 * 24 * 60 * 60) {
        const key = userId + '-' + uuid();
        return this.client.set(key, JSON.stringify(data), 'EX', exp);
    }

    getSession(session: string) {
        return new Promise((resolve, reject) => {
            this.client.get(session).then(res => {
                if (res) {
                    resolve(JSON.parse(res));
                } else {
                    resolve({});
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
                match: userId + '-*',
                count: 100,
            });

            const keys: string[] = [];

            stream.on('data', (resultKeys) => {
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
}

export const sessionStorage = new SessionStorage(0);