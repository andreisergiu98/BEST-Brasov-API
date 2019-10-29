import {BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './user';
import {MeetingParticipant} from './meeting-participant';

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
}