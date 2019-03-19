import {Document, Schema, model} from "mongoose";

export interface IEntity extends Document {
    name: string;
    city?: string;
    address?: string;
    categories?: [string];
    website?: string;
    phoneNumbers?: [object];
    emailAddresses?: [object];
    numberOfCalls?: number;
    comments?: [string];
}

export const EntitySchema = new Schema({
    name: {type: String, required: true},
    city: String,
    address: String,
    categories: [{type: Schema.Types.ObjectId, ref: 'EntityCategory', autopopulate: true}],
    website: String,
    phoneNumbers: [{phone: String, info: String}],
    emailAddresses: [{email: String, info: String}],
    numberOfCalls: Number,
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', autopopulate: true}]
}, {timestamps: true});

EntitySchema.plugin(require('mongoose-autopopulate'));

const Entity = model<IEntity>('Entity', EntitySchema);
export default Entity;