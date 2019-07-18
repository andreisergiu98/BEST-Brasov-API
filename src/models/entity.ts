import {arrayProp, prop, Ref, Typegoose} from 'typegoose';
import mongoose, {Types} from 'mongoose';

import {EntityCategory} from './entity-category';
import {User} from './user';

export class PhoneNumber {
    @prop()
    phone!: string;

    @prop()
    info!: string;
}

export class EmailAddress {
    @prop()
    email!: string;

    @prop()
    info!: string;
}

export class Comment {
    @prop()
    text!: string;

    @prop({default: new Date()})
    date!: Date;

    @prop({ref: 'User'})
    user!: Ref<User>;
}

export class Entity extends Typegoose {
    _id!: Types.ObjectId;

    createdAt!: Date;

    updatedAt!: Date;

    @prop({required: true})
    name!: string;

    @prop()
    city?: string;

    @prop()
    address?: string;

    @prop()
    website?: string;

    @prop({default: 0})
    numberOfCalls!: number;

    @arrayProp({items: PhoneNumber, default: []})
    phoneNumbers?: [Ref<PhoneNumber>];

    @arrayProp({items: EmailAddress, default: []})
    emailAddresses?: [Ref<EmailAddress>];

    @arrayProp({items: Comment, default: []})
    comments!: [Ref<Comment>];

    @arrayProp({itemsRef: {name: 'EntityCategory'}, default: []})
    categories!: [Ref<EntityCategory>];
}

// tslint:disable-next-line:variable-name
export const EntityModel = new Entity().getModelForClass(Entity, {
    schemaOptions: {timestamps: true},
    existingMongoose: mongoose,
});
