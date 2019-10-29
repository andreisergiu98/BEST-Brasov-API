import {RBAC} from '../core/rbac';
import {Controller, ControllerOptions} from '../core/controller';

import {Meeting} from '../models/meeting';

export class MeetingsController extends Controller<Meeting> {
    constructor() {
        super(Meeting, meetingOptions);
    }
}

const meetingOptions: ControllerOptions = {
    create: {
        access: RBAC.roles.moderator,
    },
    update: {
        access: RBAC.roles.moderator,
    },
    delete: {
        access: RBAC.roles.admin,
    },
};