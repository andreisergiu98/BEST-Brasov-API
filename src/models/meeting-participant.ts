import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Meeting} from './meeting';
import {User} from './user';

@Entity()
export class MeetingParticipant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'integer'})
    userId!: number;

    @Column({type: 'integer'})
    meetingId!: number;

    @Column({type: 'boolean', default: false})
    confirmed!: boolean;

    @OneToOne(() => User)
    @JoinColumn({name: 'userId'})
    user?: User;

    @ManyToOne(() => Meeting, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'meetingId'})
    meeting?: Meeting;
}