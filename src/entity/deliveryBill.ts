import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer';
import { DeliveryBillDish } from './deliveryBillDish';
import { User } from './user';

@Entity()
export class DeliveryBill extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public prepareAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public preparedAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public shipAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public collectAt: Date;

    @Column('money', { nullable: true })
    public collectValue: number;

    @Column({ length: 20, nullable: true })
    public voucherCode: string;

    @Column({ nullable: true })
    public voucherValue: number;

    @Column({ length: 20, nullable: true })
    public discountCode: string;

    @Column({ nullable: true })
    public discountValue: number;

    @Column('float', { nullable: true })
    public rate: number;

    @Column({ nullable: true })
    public note: string;

    @ManyToOne(_type => User, { onDelete: 'NO ACTION' })
    public prepareBy: User;

    @ManyToOne(_type => User, { onDelete: 'NO ACTION' })
    public shipBy: User;

    @ManyToOne(_type => Customer, customer => customer.deliveryBills, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'customerId' })
    public customer: Customer;

    @Column()
    public customerId: number;

    @OneToMany(() => DeliveryBillDish, dish => dish.deliveryBill, { nullable: false })
    public dishes: DeliveryBillDish[];
}
