import {Document, Schema, model} from "mongoose";

export interface ICategory extends Document {
    name: string;
}

export const CategorySchema = new Schema({
    name: {type: String, required: true, unique: true}
});

const Category = model<ICategory>('Category', CategorySchema);
export default Category;

