import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true, update: false, length: 20 })
    public slug: string;

    @Column({ length: 100 })
    public name: string;

    @Column({ nullable: true })
    public description: string;

    @Column({ type: 'int' })
    public level: number;

    @Column('text', { array: true, nullable: true })
    public permissions: string[];

    @ManyToMany(_type => User)
    public users: User[];
}
