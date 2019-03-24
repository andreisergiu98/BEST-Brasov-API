import {Document, Schema, model} from "mongoose";
import {IEntityCategory} from "./entity-category";
import {IComment} from "./comment";

export interface IEntity extends Document {
    name: string;
    city?: string;
    address?: string;
    categories?: [IEntityCategory | string];
    website?: string;
    phoneNumbers?: [{ phone: string, info: string }];
    emailAddresses?: [{ email: string, info: string }];
    numberOfCalls?: number;
    comments?: [IComment | string];
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
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true});

EntitySchema.plugin(require('mongoose-autopopulate'));

const Entity = model<IEntity>('Entity', EntitySchema);
export default Entity;