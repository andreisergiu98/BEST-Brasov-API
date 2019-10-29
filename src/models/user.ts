import {Entity, Column, PrimaryGeneratedColumn, BaseEntity} from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'text', unique: true})
    email!: string;

    @Column({type: 'text'})
    name!: string;

    @Column({type: 'text', nullable: true})
    status?: string;

    @Column({type: 'text', nullable: true})
    phone?: string;

    @Column({type: 'text', nullable: true})
    photo?: string;

    @Column({type: 'text', nullable: true})
    birthDate?: string;

    @Column({type: 'text', nullable: true})
    joinDate?: string;

    @Column({type: 'text', nullable: true})
    generation?: string;

    @Column({type: 'text', default: 'user'})
    role!: string;

    constructor(user?: User) {
        super();
        if (user) {
            this.id = user.id;
            this.email = user.email;
            this.name = user.name;
            this.status = user.status;
            this.phone = user.phone;
            this.photo = user.photo;
            this.birthDate = user.birthDate;
            this.joinDate = user.joinDate;
            this.generation = user.generation;
            this.role = user.role;
        }
    }
}