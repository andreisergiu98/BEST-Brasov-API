import {BaseEntity, Column, Entity as TypeormEntity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

import {User} from './user';
import {Entity} from './entity';

import {initOne} from '../utils/db';

@TypeormEntity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('text')
    text!: string;

    @Column('timestamp')
    date!: Date;

    @Column('integer')
    userId!: number;

    @Column({nullable: true})
    entityId?: number;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user?: User;

    @ManyToOne(() => Entity, entity => entity.comments, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'entity_id'})
    entity?: Entity;

    constructor(comment?: Comment) {
        super();
        if (comment) {
            this.id = comment.id;
            this.text = comment.text;
            this.date = comment.date;
            this.userId = comment.userId;
            this.entityId = comment.entityId;
            this.user = initOne(User, comment.user);
            this.entity = initOne(Entity, comment.entity);
        }
    }
}