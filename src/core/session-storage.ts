import {Redis} from 'ioredis';
import crypto from 'crypto';
import util from 'util';

import {config} from '../config';
import {RedisClient} from './redis';
import {User} from '../models/user';

const randomBytes = util.promisify(crypto.randomBytes);

interface SessionRedis extends Redis {
    getUser: (key: string) => Promise<string | undefined>;
}

export interface SessionData {
    id: number;
    role: string;
    pttl: number;
    session: string;
}

class SessionStorage extends RedisClient {
    private readonly exp = config.auth.maxAge;
    private readonly tokenSize = config.auth.tokenSize;

    client!: SessionRedis;

    async onConnected() {
        const userNamespace = this.getUserKey('');
        this.client.defineCommand('getUser', {
            numberOfKeys: 1,
            // language=Lua
            lua: `
                local id = redis.call('get', KEYS[1])
                if id == false then return false end
                local ttl = redis.call('pttl', KEYS[1])
                return { 
                    redis.call('hmget', '${userNamespace}' .. id, 
                    'id', 'role'
                    ), ttl}
            `,
        });
    }

    async getSession(sessionId: string): Promise<SessionData | undefined> {
        const key = this.getSessionKey(sessionId);
        const res = await this.client.getUser(key);

        if (!res) return;
        const [[id, role], ttl] = res;

        if (!id) return;

        return {
            id: Number(id),
            role,
            session: sessionId,
            pttl: Number(ttl),
        };
    }

    async createSession(user: User, useragent: string) {
        const sessionId = user.id + ':' + (await randomBytes(this.tokenSize)).toString('base64');

        const userKey = this.getUserKey(user.id);
        const sessionData = this.buildData(user);
        const sessionKey = this.getSessionKey(sessionId);

        await this.client.hmset(userKey, sessionData);
        await this.client.pexpire(userKey, this.exp);
        await this.client.set(sessionKey, user.id, 'px', this.exp);

        return {sessionId, sessionData};
    }

    async extendSession(sessionId: string, userId: number) {
        const promises = [];
        promises.push(this.client.pexpire(this.getSessionKey(sessionId), this.exp));
        promises.push(this.client.pexpire(this.getUserKey(userId), this.exp));
        return Promise.all(promises);
    }

    async updateData(user: User) {
        const key = this.getUserKey(user.id);
        const data = this.buildData(user);

        const exists = this.client.exists(key);
        if (!exists) return;

        await this.client.hmset(key, data);
        await this.client.pexpire(key, this.exp);
    }

    async deleteSession(sessionId: string) {
        return this.client.unlink(this.getSessionKey(sessionId));
    }

    async deleteAllSessions(userId: number) {
        const keys = await this.scanStream({
            match: this.getSessionKey(userId + ':') + '*',
        });
        if (keys.length === 0) return;
        return this.client.unlink(...keys);
    }

    private getUserKey(userId: number | string) {
        return 'user:' + userId;
    }

    private getSessionKey(sessionId: string) {
        return 'session:' + sessionId;
    }

    private buildData(user: User) {
        return {
            id: user.id,
            role: user.role,
        };
    }
}

export const sessionStorage = new SessionStorage(config.auth.database);