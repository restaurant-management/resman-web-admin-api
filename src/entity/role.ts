import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@ObjectType()
@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column({ unique: true, update: false, length: 20 })
    public slug: string;

    @Field()
    @Column({ length: 100 })
    public name: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public description: string;

    @Field()
    @Column({ type: 'int' })
    public level: number;

    @Field(() => [String])
    @Column('text', { array: true, nullable: true })
    public permissions: string[];

    @ManyToMany(_type => User, user => user.roles)
    public users: User[];
}
