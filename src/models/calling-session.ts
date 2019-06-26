// import {Document, Schema, model, Model} from 'mongoose';
// import {EventType} from './event';
// import {User} from './user';
// import {EntityType} from './entity';
//
// export interface CallingSessionType extends Document {
//     event?: EventType | string;
//     name?: string;
//     coordinator?: User | string;
//     entities: [{
//         entity: EntityType | string;
//         explicit: boolean;
//         assigned?: User | string;
//         status: string;
//         lastUpdate: Date;
//     }];
//     date: {
//         start: Date,
//         end: Date
//     };
//     links: {
//         booklet?: string;
//         phoneTemplate?: string;
//         emailTemplate?: string;
//         sponsorshipTemplate?: string;
//     };
// }
//
// const callingSessionSchema = new Schema({
//     event: {type: Schema.Types.ObjectId, ref: 'Event'},
//     name: String,
//     coordinator: {type: Schema.Types.ObjectId, ref: 'User'},
//     entities: [{
//         entity: {type: Schema.Types.ObjectId, required: true, ref: 'EntityType'},
//         explicit: Boolean,
//         assigned: {type: Schema.Types.ObjectId, ref: 'User'},
//         status: String,
//         lastUpdate: Date,
//     }],
//     date: {
//         start: Date,
//         end: Date,
//     },
//     links: {
//         booklet: String,
//         phoneTemplate: String,
//         emailTemplate: String,
//         sponsorshipTemplate: String,
//     },
// }, {timestamps: true});
//
// // tslint:disable-next-line:variable-name
// export const CallingSession = model('CallingSession', callingSessionSchema) as Model<CallingSessionType>;