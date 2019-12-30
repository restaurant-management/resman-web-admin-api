import { MaxLength } from 'class-validator';
import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SoftDeleteEntity } from '../lib/softDeleteEntity';
import { StaffSocketBill } from '../socket/staffBill.socket';
import { BillDish } from './billDish';
import { BillHistory } from './billHistory';
import { Customer } from './customer';
import { Store } from './store';
import { User } from './user';

@ObjectType()
@Entity()
export class Bill extends SoftDeleteEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field(() => Int)
    @Column()
    public tableNumber: number;

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
    public collectAt: Date;

    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    public collectValue: number;

    @Field({ nullable: true })
    @MaxLength(20)
    @Column({ length: 20, nullable: true })
    public voucherCode: string;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    public voucherValue: number;

    @Field(() => Boolean, { nullable: true })
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
    @ManyToOne(_type => User, { nullable: false, onDelete: 'NO ACTION' })
    public createBy: User;

    @Field(() => User, { nullable: true })
    @ManyToOne(_type => User, { nullable: true, onDelete: 'NO ACTION' })
    public prepareBy: User;

    @Field(() => User, { nullable: true })
    @ManyToOne(_type => User, { nullable: true, onDelete: 'NO ACTION' })
    public collectBy: User;

    @Field(() => Customer, { nullable: true })
    @ManyToOne(_type => Customer, customer => customer.bills, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'customerId' })
    public customer: Customer;

    @Field(() => BillHistory, { nullable: true })
    @OneToMany(_type => BillHistory, history => history.bill)
    public histories: BillHistory[];

    @Field(() => [BillDish], { nullable: true })
    public dishes: BillDish[];

    public toStaffSocketBill(): StaffSocketBill {
        return {
            billId: this.id,
            tableNumber: this.tableNumber,
            amountPreparedDishes:
                this.dishes.filter(dish => dish.preparedAt).length - this.dishes.filter(dish => dish.deliveryAt).length,
            status: !this.prepareBy
                ? 'no-prepare'
                : (this.dishes.filter(dish => !dish.preparedAt).length > 0)
                    ? 'preparing' :
                    (this.dishes.filter(dish => !dish.deliveryAt).length > 0) ? 'prepared' : 'delivered'
        };
    }
}
