import {Document, Schema, model} from "mongoose";

export interface IUser extends Document {
    email: string;
    name: string;
    status?: string;
    phone?: string;
    photo?: string;
    birthDate?: string;
    joinDate?: string;
    generation?: string;
}

export const UserSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    status: String,
    phone: String,
    photo: String,
    birthDate: String,
    joinDate: String,
    generation: String
}, {timestamps: true});

const User = model<IUser>('User', UserSchema);
export default User;