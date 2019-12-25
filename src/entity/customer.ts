import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address';
import { Bill } from './bill';
import { Comment } from './comment';
import { dateScalar } from './dailyDish';
import { DeliveryBill } from './deliveryBill';
import { Dish } from './dish';
import { SettingsScalar } from './user';
import { VoucherCode } from './voucherCode';

@ObjectType()
@Entity()
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column()
    @Generated('uuid')
    public uuid: string;

    @Field()
    @Column({ unique: true })
    public username: string;

    @Field({ nullable: true })
    @Column({ length: 100, nullable: true })
    public fullName: string;

    @Field()
    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public avatar: string;

    @Field(() => dateScalar, { nullable: true })
    @Column('date', { nullable: true })
    public birthday: Date;

    @Field({ nullable: true })
    @Column({ length: 20, nullable: true, unique: true })
    public phoneNumber: string;

    @Field(() => [Address], { nullable: true })
    @OneToMany(_type => Address, address => address.customer)
    public addresses: Address[];

    @Field(() => SettingsScalar)
    @Column('json', { default: {} })
    public settings: object;

    @OneToMany(_type => Bill, bill => bill.customer)
    public bills: Bill[];

    @OneToMany(_type => DeliveryBill, deliveryBill => deliveryBill.customer)
    public deliveryBills: DeliveryBill[];

    @OneToMany(_type => Comment, comment => comment.createBy, { nullable: true })
    public comments: Comment[];

    @Field(() => [Dish], { nullable: true })
    @ManyToMany(() => Dish, dish => dish.favouriteCustomers, { nullable: true })
    @JoinTable()
    public favouriteDishes: Dish[];

    @Field(() => [VoucherCode], { nullable: true })
    @OneToMany(() => VoucherCode, voucherCode => voucherCode.customer, { nullable: true })
    public voucherCodes: VoucherCode[];
}
