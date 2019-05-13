import {Document, Schema, model} from 'mongoose';
import {IUser} from './user';

export interface IComment extends Document {
    value: string;
    user: IUser | string;
}

export const CommentSchema = new Schema({
    value: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true},
}, {timestamps: true});

CommentSchema.plugin(require('mongoose-autopopulate'));

const Comment = model<IComment>('Comment', CommentSchema);
export default Comment;