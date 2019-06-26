// import {Document, Schema, model} from 'mongoose';
// import {User} from './user';
// import {CallingSessionType} from './calling-session';
//
//
//
// export interface EventType extends Document {
//     name: string;
//     coordinator: User | string;
//     coreTeam: [{
//         user: User | string,
//         role: string
//     }];
//     usefulLinks: [{
//         description: string,
//         link: string
//     }];
//     callingSession: CallingSessionType | string;
//     date: {
//         starts: Date;
//         ends: Date;
//     };
// }
//
// const eventSchema = new Schema({
//     name: {type: String, required: true},
//     coordinator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
//     coreTeam: [{
//         user: {type: Schema.Types.ObjectId, ref: 'User'},
//         role: String,
//     }],
//     usefulLinks: [{
//         description: String,
//         link: String,
//     }],
//     callingSession: {type: Schema.Types.ObjectId, ref: 'CallingSessionType'},
//     date: {
//         starts: Date,
//         ends: Date,
//     },
// }, {timestamps: true});
//
// // tslint:disable-next-line:variable-name
// export const Event = model<EventType>('Event', eventSchema);
