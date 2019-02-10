import {Document, Schema, model} from "mongoose";

export interface IEntity extends Document {
    name?: string;
    city?: string;
    address?: string;
    categories?: [string];
    phoneNumbers?: [object];
    emailAddresses?: [object];
    contacts?: [object];
}

export const EntitySchema = new Schema({
    name: {type: String, required: true},
    city: String,
    address: String,
    categories: [String],
    phoneNumbers: [{phone: String, info: String}],
    emailAddresses: [{email: String, info: String}],
    contacts: [{name: String, position: String, email: [String], phoneNumbers: [String]}],
});

const Entity = model<IEntity>('Entity', EntitySchema);
export default Entity;