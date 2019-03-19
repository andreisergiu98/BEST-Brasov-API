import {Document, Schema, model} from "mongoose";

export interface IComment extends Document {
    value: string;
    user: object;
}

export const CommentSchema = new Schema({
    value: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true},
}, {timestamps: true});

CommentSchema.plugin(require('mongoose-autopopulate'));

const Comment = model<IComment>('Comment', CommentSchema);
export default Comment;