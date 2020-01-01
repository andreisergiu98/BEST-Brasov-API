import {RBAC} from '../core/rbac';
import {Controller} from '../core/controller';

import {Entity} from '../models/entity';
import {EntityCategory} from '../models/entity-category';

export class EntitiesController extends Controller<Entity> {
    categories = new Controller(EntityCategory, {
        delete: {
            access: RBAC.roles.admin,
        },
    });

    constructor() {
        super(Entity, {
            delete: {
                access: RBAC.roles.moderator,
            },
        });
    }
}