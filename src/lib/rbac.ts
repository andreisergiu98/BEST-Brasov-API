import Koa from 'koa';

interface Role {
    id: string;
    level: number;
    canBePromotedBy: string[];
}

export class RBAC {
    static roles = {
        superAdmin: {
            id: 'super_admin',
            level: -1,
            canBePromotedBy: [],
        } as Role,
        admin: {
            id: 'admin',
            level: 0,
        } as Role,
        moderator: {
            id: 'moderator',
            level: 25,
            canBePromotedBy: ['admin'],
        } as Role,
        coordinator: {
            id: 'coordinator',
            level: 50,
            canBePromotedBy: ['admin'],
        } as Role,
        teamMember: {
            id: 'core_team_member',
            level: 75,
            canBePromotedBy: ['admin', 'moderator', 'coordinator'],
        } as Role,
        user: {
            id: 'user',
            level: 100,
            canBePromotedBy: ['admin', 'moderator', 'coordinator'],
        } as Role,
        guest: {
            id: 'guest',
            level: 1000,
            canBePromotedBy: ['admin'],
        } as Role,
    };

    static validateRole(roleId: string): boolean {
        for (const [key, value] of Object.entries(RBAC.roles)) {
            if (value.id === roleId) {
                return true;
            }
        }
        return false;
    }

    static authorize(role: Role) {
        return async (ctx: Koa.Context, next: Function) => {
            await next();
        };
    }
}