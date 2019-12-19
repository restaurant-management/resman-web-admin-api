import { MaxLength } from 'class-validator';
import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SoftDeleteEntity } from '../lib/softDeleteEntity';
import { Customer } from './customer';
import { DeliveryBillDish } from './deliveryBillDish';
import { Store } from './store';
import { User } from './user';

@ObjectType()
@Entity()
export class DeliveryBill extends SoftDeleteEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    public insertAt: Date;

    @Field()
    @Column({ type: 'timestamp with time zone' })
    public createAt: Date;

    @Field({ nullable: true })
    @Column('timestamp with time zone', { nullable: true })
    public prepareAt: Date;

    @Field({ nullable: true })
    @Column('timestamp with time zone', { nullable: true })
    public preparedAt: Date;

    @Field({ nullable: true })
    @Column('timestamp with time zone', { nullable: true })
    public shipAt: Date;

    @Field({ nullable: true })
    @Column('timestamp with time zone', { nullable: true })
    public collectAt: Date;

    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    public collectValue: number;

    @Field()
    @Column('text')
    public address: string;

    @Field(() => Float)
    @Column('float', { nullable: true })
    public longitude: number;

    @Field(() => Float)
    @Column('float', { nullable: true })
    public latitude: number;

    @Field({ nullable: true })
    @Column({ length: 20, nullable: true })
    public voucherCode: string;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    public voucherValue: number;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    public voucherIsPercent: boolean;

    @Field({ nullable: true })
    @MaxLength(20)
    @Column({ length: 20, nullable: true })
    public discountCode: string;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    public discountValue: number;

    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    public rating: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public note: string;

    @Field(() => Store, { nullable: true })
    @ManyToOne(_type => Store, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    public store: Store;

    @Field(() => User, { nullable: true })
    @ManyToOne(_type => User, { onDelete: 'NO ACTION' })
    public prepareBy: User;

    @Field(() => User, { nullable: true })
    @ManyToOne(_type => User, { onDelete: 'NO ACTION' })
    public shipBy: User;

    @Field(() => Customer, { nullable: true })
    @ManyToOne(_type => Customer, customer => customer.deliveryBills, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'customerId' })
    public customer: Customer;

    @Column()
    public customerId: number;

    @Field(() => DeliveryBillDish, { nullable: true })
    @OneToMany(() => DeliveryBillDish, dish => dish.deliveryBill, { nullable: false })
    public dishes: DeliveryBillDish[];
}
