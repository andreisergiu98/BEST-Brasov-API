import {Document, Schema, model} from "mongoose";
import {IEvent} from "./event";
import {IUser} from "./user";
import {IEntity} from "./entity";

export interface ICallingSession extends Document {
    event?: IEvent | string;
    name?: string;
    coordinator?: IUser | string;
    entities: [{
        entity: IEntity | string;
        explicit: boolean;
        assigned: IUser | string;
        status: string;
        lastUpdate: Date;
    }]
    date: {
        start: Date,
        end: Date
    }
    links: {
        booklet?: string;
        phoneTemplate?: string;
        emailTemplate?: string;
        sponsorshipTemplate?: string;
    }
}

export const CallingSessionSchema = new Schema({
    event: {type: Schema.Types.ObjectId, ref: 'Event'},
    name: String,
    coordinator: {type: Schema.Types.ObjectId, ref: 'User'},
    entities: [{
        entity: {type: Schema.Types.ObjectId, required: true, ref: 'Entity'},
        explicit: Boolean,
        assigned: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
        status: String,
        lastUpdate: Date
    }],
    date: {
        start: Date,
        end: Date
    },
    links: {
        booklet: String,
        phoneTemplate: String,
        emailTemplate: String,
        sponsorshipTemplate: String,
    }
}, {timestamps: true});

const CallingSession = model<ICallingSession>('CallingSession', CallingSessionSchema);
export default CallingSession;