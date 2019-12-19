import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address';
import { Bill } from './bill';
import { DeliveryBill } from './deliveryBill';
import { SettingsScalar } from './user';

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

    @Field()
    @Column()
    public password: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public avatar: string;

    @Field({ nullable: true })
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
}
