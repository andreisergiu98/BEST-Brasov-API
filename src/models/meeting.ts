import {Document, Schema, model} from "mongoose";
import {IUser} from "./user";

export interface IMeeting extends Document {
    facilitator: IUser | string;
    name: string;
    date: string;
    tags: [string];
    participants: [IUser | string];
    pendingApproval: [IUser | string];
}

export const MeetingSchema = new Schema({
    facilitator: {type: Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true},
    name: {type: String, required: true},
    date: {type: String},
    tags: [{type: String}],
    participants: [{type: Schema.Types.ObjectId, ref: 'User', autopopulate: true}],
    pendingApproval: [{type: Schema.Types.ObjectId, ref: 'User', autopopulate: true}],
}, {timestamps: true});

MeetingSchema.plugin(require('mongoose-autopopulate'));

const Meeting = model<IMeeting>('Meeting', MeetingSchema);
export default Meeting;