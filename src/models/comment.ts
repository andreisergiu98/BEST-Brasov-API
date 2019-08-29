import {Column, Entity as TypeormEntity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './user';
import {Entity} from './entity';

@TypeormEntity()
export class Comment {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type: 'integer'})
    userId!: number;

    @Column({type: 'integer', nullable: true},)
    entityId?: number;

    @Column({type: 'text'})
    text!: string;

    @Column({type: 'timestamp'})
    date!: Date;

    @ManyToOne(() => User)
    @JoinColumn({name: 'userId'})
    user?: User;

    @ManyToOne(() => Entity, entity => entity.comments, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'entityId'})
    entity?: Entity;

    constructor(comment?: Comment) {
        if (comment) {
            this.id = comment.id;
            this.text = comment.text;
            this.date = comment.date;
            this.userId = comment.userId;
            this.entityId = comment.entityId;
        }
    }
}