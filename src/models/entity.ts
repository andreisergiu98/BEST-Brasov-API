import {
    Entity as TypeormEntity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';
import {EntityCategory} from './entity-category';
import {Comment} from './comment';

@TypeormEntity()
export class Entity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'text'})
    name!: string;

    @Column({type: 'text', default: ''})
    city!: string;

    @Column({type: 'text', default: ''})
    address!: string;

    @Column({type: 'text', default: ''})
    website!: string;

    @Column({type: 'integer', default: 0})
    numberOfCalls!: number;

    @Column({type: 'json', default: [], nullable: true})
    phoneNumbers!: [{ phone: string, info: string }];

    @Column({type: 'json', default: [], nullable: true})
    emailAddress!: [{ email: string, info: string }];

    @ManyToMany(() => EntityCategory, category => category.entities, {
        eager: true,
        cascade: true,
    })
    @JoinTable({name: 'entity_categories'})
    categories!: EntityCategory[];

    @OneToMany(() => Comment, comment => comment.entity)
    comments?: Comment[];

    constructor(entity?: Entity) {
        if (entity) {
            this.id = entity.id;
            this.name = entity.name;
            this.city = entity.city;
            this.address = entity.address;
            this.website = entity.website;
            this.numberOfCalls = entity.numberOfCalls;
            this.phoneNumbers = entity.phoneNumbers;
            this.emailAddress = entity.emailAddress;
            this.categories = entity.categories;
        }
    }
}