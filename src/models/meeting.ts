import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './user';
import {MeetingParticipant} from './meeting-participant';

@Entity()
export class Meeting {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'text'})
    name!: string;

    @Column({type: 'date'})
    date?: Date;

    @Column({type: 'text', array: true})
    tags!: string[];

    @Column({type: 'integer'})
    facilitatorId!: number;

    @OneToOne(() => User)
    @JoinColumn({name: 'facilitator_id'})
    facilitator?: User;

    @OneToMany(() => MeetingParticipant, participant => participant.meeting)
    participants?: MeetingParticipant[];
}