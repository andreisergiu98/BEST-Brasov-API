import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
};

export const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: String,
});

const User = model<IUser>('User', UserSchema);

export default User;