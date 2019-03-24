import {Document, Schema, model} from "mongoose";
import {IUser} from "./user";
import {ICallingSession} from "./calling-session";

export interface IEvent extends Document {
    name: string;
    coordinator: IUser | string;
    coreTeam: [{
        user: IUser | string,
        role: string
    }];
    usefulLinks: [{
        description: string,
        link: string
    }];
    callingSession: ICallingSession | string;
    date: {
        starts: Date;
        ends: Date;
    };
}

export const EventSchema = new Schema({
    name: {type: String, required: true},
    coordinator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    coreTeam: [{
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        role: String
    }],
    usefulLinks: [{
        description: String,
        link: String
    }],
    callingSession: {type: Schema.Types.ObjectId, ref: 'CallingSession'},
    date: {
        starts: Date,
        ends: Date
    }
}, {timestamps: true});

const Event = model<IEvent>('Event', EventSchema);
export default Event;