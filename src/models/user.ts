import {prop, Typegoose} from 'typegoose';
import mongoose, {Types} from 'mongoose';

import {Meeting} from './meeting';

export class User extends Typegoose {
    _id!: Types.ObjectId;

    createdAt!: Date;

    updatedAt!: Date;

    @prop({required: true, unique: true})
    email!: string;

    @prop({required: true})
    name!: string;

    @prop()
    status?: string;

    @prop()
    phone?: string;

    @prop()
    photo?: string;

    @prop()
    birthDate?: string;

    @prop()
    joinDate?: string;

    @prop()
    generation?: string;

    @prop({ref: 'Meeting', justOne: false, overwrite: false, localField: '_id', foreignField: 'participants'})
    get meetings() {
        return [] as Meeting[] | undefined;
    }
}

// tslint:disable-next-line:variable-name
export const UserModel = new User().getModelForClass(User, {
    schemaOptions: {timestamps: true},
    existingMongoose: mongoose,
});