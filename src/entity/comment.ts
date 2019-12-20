import { MaxLength } from 'class-validator';
import { Field, Float, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer';
import { Dish } from './dish';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @CreateDateColumn({ type: 'timestamp with time zone' })
    public createAt: Date;

    @Field(() => Customer)
    @ManyToOne(_type => Customer, customer => customer.comments, { onDelete: 'CASCADE' })
    public createBy: Customer;

    @Field(() => Float, { defaultValue: 2.5 })
    @Column('float')
    public rating: number;

    @Field()
    @MaxLength(100)
    @Column({ length: 100 })
    public content: string;

    @Field(() => Dish)
    @ManyToOne(_type => Dish, dish => dish.comments, { onDelete: 'CASCADE' })
    public dish: Dish;
}
