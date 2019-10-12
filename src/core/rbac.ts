import Koa from 'koa';

interface Role {
    id: string;
    level: number;
    canBePromotedBy: string[];
}

export class RBAC {
    static validateRole(roleId: string): boolean {
        for (const [key, value] of Object.entries(RBAC.roles)) {
            if (value.id === roleId) {
                return true;
            }
        }
        return false;
    }

    static getRoleBy(roleId: string): Role | undefined {
        for (const [key, value] of Object.entries(RBAC.roles)) {
            if (value.id === roleId) {
                return value;
            }
        }
    }

    static restrictAccess(role: Role) {
        return async (ctx: Koa.Context, next: Function) => {
            const userRole = this.getRoleBy(ctx.state.user.role);

            if (!userRole) {
                throw Error(`Role: ${ctx.state.user.role} of user: ${ctx.state.user.id}, ${ctx.state.user.name} does not exist!`);
            }

            if (userRole.level > role.level) {
                ctx.throw(403);
                return;
            }

            await next();
        };
    }

    static roles: { [key: string]: Role } = {
        superAdmin: {
            id: 'super_admin',
            level: -1,
            canBePromotedBy: [],
        },
        admin: {
            id: 'admin',
            level: 0,
            canBePromotedBy: [],
        },
        mdv: {
            id: 'mdv',
            level: 25,
            canBePromotedBy: ['admin'],
        },
        moderator: {
            id: 'moderator',
            level: 50,
            canBePromotedBy: ['admin', 'mdv'],
        },
        coordinator: {
            id: 'coordinator',
            level: 75,
            canBePromotedBy: ['admin', 'mdv'],
        },
        teamMember: {
            id: 'core_team_member',
            level: 100,
            canBePromotedBy: ['admin', 'mdv', 'moderator', 'coordinator'],
        },
        user: {
            id: 'user',
            level: 150,
            canBePromotedBy: ['admin', 'mdv', 'moderator', 'coordinator'],
        },
        guest: {
            id: 'guest',
            level: 1000,
            canBePromotedBy: ['admin'],
        },
    };
}