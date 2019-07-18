import {arrayProp, prop, Ref, Typegoose} from 'typegoose';
import mongoose, {Types} from 'mongoose';

import {User} from './user';

export class Meeting extends Typegoose {
    _id!: Types.ObjectId;

    createdAt!: Date;

    updatedAt!: Date;

    @prop({required: true, ref: {name: 'User'}})
    facilitator!: Ref<User>;

    @prop({required: true})
    name!: string;

    @prop()
    date?: string;

    @prop({default: []})
    tags!: [string];

    @arrayProp({itemsRef: {name: 'User'}})
    participants!: [Ref<User>];

    @arrayProp({itemsRef: {name: 'User'}})
    pendingApproval!: [Ref<User>];
}

// tslint:disable-next-line:variable-name
export const MeetingModel = new Meeting().getModelForClass(Meeting, {
    schemaOptions: {timestamps: true},
    existingMongoose: mongoose,
});
