import {BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

import {User} from './user';
import {MeetingParticipant} from './meeting-participant';

import {initArray, initOne} from '../utils/db';

@Entity()
export class Meeting extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name!: string;

    @Column('date')
    date?: Date;

    @Column('text', {array: true})
    tags!: string[];

    @Column('integer')
    facilitatorId!: number;

    @OneToOne(() => User)
    @JoinColumn({name: 'facilitator_id'})
    facilitator?: User;

    @OneToMany(() => MeetingParticipant, participant => participant.meeting)
    participants?: MeetingParticipant[];

    constructor(meeting?: Meeting) {
        super();
        if (meeting) {
            this.id = meeting.id;
            this.name = meeting.name;
            this.date = meeting.date;
            this.tags = meeting.tags;
            this.facilitatorId = meeting.facilitatorId;
            this.facilitator = initOne(User, meeting.facilitator);
            this.participants = initArray(MeetingParticipant, meeting.participants);
        }
    }
}