import {prop, Typegoose} from 'typegoose';
import mongoose, {Types} from 'mongoose';

export class EntityCategory extends Typegoose {
    _id!: Types.ObjectId;

    createdAt!: Date;

    updatedAt!: Date;

    @prop({required: true, unique: true})
    name!: string;
}

// tslint:disable-next-line:variable-name
export const EntityCategoryModel = new EntityCategory().getModelForClass(EntityCategory, {
    schemaOptions: {timestamps: true},
    existingMongoose: mongoose,
});