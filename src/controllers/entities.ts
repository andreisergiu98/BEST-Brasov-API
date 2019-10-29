import {RBAC} from '../core/rbac';
import {Controller} from '../core/controller';

import {Entity} from '../models/entity';
import {EntityCategory} from '../models/entity-category';

export class EntitiesController extends Controller<Entity> {
    categories = new Controller(EntityCategory, categoriesOptions);

    constructor() {
        super(Entity, entityOptions);
    }
}

const entityOptions = {
    delete: {
        access: RBAC.roles.moderator,
    },
};

const categoriesOptions = {
    delete: {
        access: RBAC.roles.admin,
    },
};
