import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BillHistory } from './billHistory';
import { Dish } from './dish';
import { ObjectType, Field, ID, Int, Float } from 'type-graphql';

@ObjectType()
@Entity()
export class BillDish extends BaseEntity {
    @Field(() => BillHistory, { nullable: true })
    @ManyToOne(_type => BillHistory, history => history.dishes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'billHistoryId' })
    public billHistory: BillHistory;

    @Field(() => ID)
    @PrimaryColumn()
    public billHistoryId: number;

    @Field(() => Dish, { nullable: true })
    @ManyToOne(_type => Dish, { nullable: false, onDelete: 'NO ACTION', eager: true })
    @JoinColumn({ name: 'dishId' })
    public dish: Dish;

    @Field(() => ID)
    @PrimaryColumn()
    public dishId: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public note: string;

    @Field({ nullable: true })
    @Column('timestamp with time zone', { nullable: true })
    public preparedAt: Date;

    @Field({ nullable: true })
    @Column('timestamp with time zone', { nullable: true })
    public deliveryAt: Date;

    @Field(() => Int, { defaultValue: 1 })
    @Column('smallint', { default: 1 })
    public quantity: number;

    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    public price: number;
}
