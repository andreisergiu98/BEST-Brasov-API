import {Document, Schema, model} from "mongoose";
import {IMeeting} from "./meeting";

export interface IUser extends Document {
    email: string;
    name: string;
    status?: string;
    phone?: string;
    photo?: string;
    birthDate?: string;
    joinDate?: string;
    generation?: string;
    meetings: IMeeting[] | string;
}

export const UserSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    status: String,
    phone: String,
    photo: String,
    birthDate: String,
    joinDate: String,
    generation: String,
    meetings: [{type: Schema.Types.ObjectId, ref: 'Meeting'}]
}, {timestamps: true});

const User = model<IUser>('User', UserSchema);
export default User;