import uuid from 'uuid/v4';
import {RedisClient} from './redis';
import {config} from '../config';
import {User} from '../models/user';

interface SessionData {
    id: number;
    name: string;
    role: string;
    photo?: string;
    expires: number;
}

class SessionStorage extends RedisClient {
    private defaultExp = 7 * 24 * 60 * 60;
    private separator = '-';

    async connect() {
        return super.connect(config.redis.url);
    }

    async createSession(userId: number, user: User, exp = this.defaultExp) {
        const session = userId + this.separator + uuid();
        const data = {
            ...this.stripUserData(user),
            expires: Date.now() + exp * 1000,
        };
        await this.client.set(session, JSON.stringify(data), 'EX', exp);
        return session;
    }

    async getSession(session: string): Promise<SessionData | undefined> {
        const res = await this.client.get(session);
        if (res) {
            return JSON.parse(res);
        }
    }

    async deleteSession(session: string) {
        return this.client.del(session);
    }

    async deleteAllSessions(userId: number) {
        const keys = await this.scanStream({
            match: userId + this.separator + '*',
            count: 100,
        });
        if (keys.length !== 0) {
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            await this.client.unlink(keys);
        }
    }

    async updateData(userId: number, user: User) {
        const keys = await this.scanStream({
            match: userId + this.separator + '*',
            count: 100,
        });

        const promises = [];

        for (const key of keys) {
            const session = await this.getSession(key);
            if(!session) continue;

            const data = JSON.stringify({
                ...this.stripUserData(user),
                expires: session.expires,
            });
            const ttl = this.calcTtl(session.expires);
            promises.push(this.client.set(key, data, 'EX', ttl));
        }

        return Promise.all(promises);
    }

    async extendSession(session: string, data: SessionData, exp = this.defaultExp) {
        data.expires = Date.now() + exp * 1000;
        return this.client.set(session, JSON.stringify(data), 'EX', exp);
    }

    private stripUserData(user: User) {
        return {
            id: user.id,
            name: user.name,
            role: user.role,
            photo: user.photo,
        };
    }
}

export const sessionStorage = new SessionStorage(config.redis.databases.sessionStorage);