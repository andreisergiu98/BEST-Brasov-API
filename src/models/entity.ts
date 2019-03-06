import {Document, Schema, model} from "mongoose";

export interface IEntity extends Document {
    name?: string;
    city?: string;
    address?: string;
    categories?: [string];
    website?: string;
    phoneNumbers?: [object];
    emailAddresses?: [object];
    numberOfCalls?: number
}

export const EntitySchema = new Schema({
    name: {type: String, required: true},
    city: String,
    address: String,
    categories: [String],
    website: String,
    phoneNumbers: [{phone: String, info: String}],
    emailAddresses: [{email: String, info: String}],
    numberOfCalls: Number
});

const Entity = model<IEntity>('Entity', EntitySchema);
export default Entity;