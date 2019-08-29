import {Entity as TypeormEntity, Column, PrimaryGeneratedColumn, ManyToMany} from 'typeorm';
import {Entity} from './entity';

@TypeormEntity()
export class EntityCategory {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type: 'text'})
    name!: string;

    @ManyToMany(() => Entity, entity => entity.categories)
    entities?: Entity[];

    constructor(category?: EntityCategory) {
        if (category) {
            this.id = category.id;
            this.name = category.name;
        }
    }
}