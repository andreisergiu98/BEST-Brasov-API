import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

import {User} from './user';
import {Meeting} from './meeting';

import {initOne} from '../utils/db';

@Entity()
export class MeetingParticipant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('boolean', {default: false})
    confirmed!: boolean;

    @Column()
    userId!: number;

    @Column()
    meetingId!: number;

    @OneToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user?: User;

    @ManyToOne(() => Meeting, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'meeting_id'})
    meeting?: Meeting;

    constructor(participant?: MeetingParticipant) {
        super();
        if (participant) {
            this.id = participant.id;
            this.userId = participant.userId;
            this.meetingId = participant.meetingId;
            this.confirmed = participant.confirmed;
            this.user = initOne(User, participant.user);
            this.meeting = initOne(Meeting, participant.meeting);
        }
    }
}