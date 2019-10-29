import {Entity as TypeormEntity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity} from 'typeorm';
import {Entity} from './entity';

@TypeormEntity()
export class EntityCategory extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('text')
    name!: string;

    @ManyToMany(() => Entity, entity => entity.categories)
    entities?: Entity[];

    constructor(category?: EntityCategory) {
        super();
        if (category) {
            this.id = category.id;
            this.name = category.name;
        }
    }
}