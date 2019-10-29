import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Meeting} from './meeting';
import {User} from './user';

@Entity()
export class MeetingParticipant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    userId!: number;

    @Column('integer')
    meetingId!: number;

    @Column('boolean', {default: false})
    confirmed!: boolean;

    @OneToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user?: User;

    @ManyToOne(() => Meeting, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'meeting_id'})
    meeting?: Meeting;
}