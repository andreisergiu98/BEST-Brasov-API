import {Document, Schema, model} from "mongoose";
import {IUser} from "./user";

export interface IEvent extends Document {
    name: string;
    coordinator: IUser | string;
    coreTeam: [{ user: IUser | string, role: string }];
    usefulLinks: [{ description: string, link: string }];
    callingSession: string;
    starts: Date;
    ends: Date;
}

export const EventSchema = new Schema({
    name: {type: String, required: true},
    coordinator: {type: Schema.Types.ObjectId, ref: 'User', autopopulate: true, required: true},
    coreTeam: [{user: {type: Schema.Types.ObjectId, ref: 'User', autopopulate: true}, role: String}],
    usefulLinks: [{description: String, link: String}],
    callingSession: {type: Schema.Types.ObjectId, ref: ''},
    starts: Date,
    ends: Date
}, {timestamps: true});

EventSchema.plugin(require('mongoose-autopopulate'));

const Event = model<IEvent>('Event', EventSchema);
export default Event;