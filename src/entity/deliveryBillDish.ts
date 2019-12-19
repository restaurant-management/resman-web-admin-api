import { MaxLength } from 'class-validator';
import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DeliveryBill } from './deliveryBill';
import { Dish } from './dish';

@ObjectType()
@Entity()
export class DeliveryBillDish extends BaseEntity {
    @Field(() => Dish)
    @ManyToOne(() => Dish, { nullable: false, onDelete: 'NO ACTION', eager: true })
    @JoinColumn({ name: 'dishId' })
    public dish: Dish;

    @Field(() => ID)
    @PrimaryColumn()
    public dishId: number;

    @ManyToOne(() => DeliveryBill, deliveryBill => deliveryBill.dishes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'deliveryBillId' })
    public deliveryBill: DeliveryBill;

    @Field(() => ID)
    @PrimaryColumn()
    public deliveryBillId: number;

    @Field()
    @MaxLength(100)
    @Column({ length: 100 })
    public name: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public note: string;

    @Field(() => Int, { defaultValue: 1 })
    @Column('smallint', { default: 1 })
    public quantity: number;

    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    public price: number;
}
