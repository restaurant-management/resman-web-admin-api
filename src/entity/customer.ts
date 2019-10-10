import { BaseEntity, Column, Entity, Generated, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Address } from './address';
import { Bill } from './bill';
import { DeliveryBill } from './deliveryBill';

@Entity()
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @Generated('uuid')
    public uuid: string;

    @Column({ unique: true })
    public username: string;

    @Column({ length: 100, nullable: true })
    public fullName: string;

    @Column({ unique: true })
    public email: string;

    @Column({ select: false })
    public password: string;

    @Column({ nullable: true })
    public avatar: string;

    @Column('date', { nullable: true })
    public birthday: Date;

    @Column({ length: 20, nullable: true, unique: true })
    public phoneNumber: string;

    @OneToMany(_type => Address, address => address.customer)
    public addresses: Address[];

    @OneToMany(_type => Bill, bill => bill.customer)
    public bills: Bill[];

    @OneToMany(_type => DeliveryBill, deliveryBill => deliveryBill.customer)
    public deliveryBills: DeliveryBill[];
}
