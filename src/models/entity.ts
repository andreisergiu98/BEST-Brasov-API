import {
    Entity as TypeormEntity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany, BaseEntity,
} from 'typeorm';

import {Comment} from './comment';
import {EntityCategory} from './entity-category';

import {initArray} from '../utils/db';

@TypeormEntity()
export class Entity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name!: string;

    @Column('text', {default: ''})
    city!: string;

    @Column('text', {default: ''})
    address!: string;

    @Column('text', {default: ''})
    website!: string;

    @Column('integer', {default: 0})
    numberOfCalls!: number;

    @Column('json', {default: [], nullable: true})
    phoneNumbers!: [{ phone: string, info: string }];

    @Column('json', {default: [], nullable: true})
    emailAddresses!: [{ email: string, info: string }];

    @ManyToMany(() => EntityCategory, category => category.entities, {
        eager: true,
        cascade: true,
    })
    @JoinTable({name: 'entity_categories'})
    categories!: EntityCategory[];

    @OneToMany(() => Comment, comment => comment.entity)
    comments?: Comment[];

    constructor(entity?: Entity) {
        super();
        if (entity) {
            this.id = entity.id;
            this.name = entity.name;
            this.city = entity.city;
            this.address = entity.address;
            this.website = entity.website;
            this.numberOfCalls = entity.numberOfCalls;
            this.phoneNumbers = entity.phoneNumbers;
            this.emailAddresses = entity.emailAddresses;
            this.categories = initArray(EntityCategory, entity.categories) || [];
            this.comments = initArray(Comment, entity.comments);
        }
    }
}