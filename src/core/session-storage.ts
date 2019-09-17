import uuid from 'uuid/v4';

import {config} from '../config';
import {RedisClient} from './redis';
import {User} from '../models/user';

import {Device, device} from '../utils/device';

interface SessionData {
    id: number;
    name: string;
    role: string;
    photo?: string;
    device: Device;
    expires: number;
}

class SessionStorage extends RedisClient {
    separator = '-';

    async getSession(key: string): Promise<SessionData | undefined> {
        const res = await this.client.get(key);
        return res ? JSON.parse(res) : undefined;
    }

    async getSessionWithKey(key: string): Promise<{ key: string, data: SessionData | undefined }> {
        const data = await this.getSession(key);
        return {key, data};
    }

    async createSession(userId: number, user: User, useragent: string, exp = config.auth.maxAge) {
        const session = userId + this.separator + uuid();
        const sessionData = SessionStorage.buildData(user, useragent, Date.now() + exp);
        await this.client.set(session, JSON.stringify(sessionData), 'PX', exp);
        return session;
    }

    async updateData(userId: number, user: User) {
        const keys = await this.scanStream({match: userId + this.separator + '*', count: 100});

        let promises = [];
        for (const key of keys) {
            promises.push(this.getSessionWithKey(key));
        }
        const sessions = await Promise.all(promises);

        promises = [];
        for (const session of sessions) {
            if (!session.data) continue;
            const ttl = session.data.expires - Date.now();
            const sessionData = SessionStorage.buildData(user, session.data.device, session.data.expires);
            promises.push(this.client.set(session.key, JSON.stringify(sessionData), 'PX', ttl));
        }

        return Promise.all(promises);
    }

    async extendSession(session: string, data: SessionData, exp = config.auth.maxAge) {
        data.expires = Date.now() + exp;
        return this.client.set(session, JSON.stringify(data), 'PX', exp);
    }

    async deleteSession(key: string) {
        return this.client.del(key);
    }

    async deleteAllSessions(userId: number) {
        const keys = await this.scanStream({match: userId + this.separator + '*', count: 100});
        if (keys.length === 0) return;
        // TODO Pull request for DefinitelyTyped approved, delete @ts-ignore after merge.
        // tslint:disable-next-line:ban-ts-ignore
        // @ts-ignore
        return this.client.unlink(...keys);
    }

    private static buildData(user: User, deviceInfo: Device | string, expires?: number) {
        if (typeof deviceInfo === 'string') {
            deviceInfo = device.getInfo(deviceInfo);
        }

        return {
            id: user.id,
            name: user.name,
            role: user.role,
            photo: user.photo,
            device: deviceInfo,
            expires,
        };
    }
}

export const sessionStorage = new SessionStorage(config.redis.databases.sessionStorage);