import {Document, Schema, model} from "mongoose";

export interface IEntityCategory extends Document {
    name: string;
}

export const CategorySchema = new Schema({
    name: {type: String, required: true, unique: true}
});

const EntityCategory = model<IEntityCategory>('EntityCategory', CategorySchema);
export default EntityCategory;