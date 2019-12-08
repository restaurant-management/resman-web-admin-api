import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SoftDeleteEntity } from '../lib/softDeleteEntity';
import { Customer } from './customer';
import { DeliveryBillDish } from './deliveryBillDish';
import { Store } from './store';
import { User } from './user';

@Entity()
export class DeliveryBill extends SoftDeleteEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    public insertAt: Date;

    @Column({ type: 'timestamp with time zone' })
    public createAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public prepareAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public preparedAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public shipAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public collectAt: Date;

    @Column('float', { nullable: true })
    public collectValue: number;

    @Column('text')
    public address: string;

    @Column('float', { nullable: true })
    public longitude: number;

    @Column('float', { nullable: true })
    public latitude: number;

    @Column({ length: 20, nullable: true })
    public voucherCode: string;

    @Column({ nullable: true })
    public voucherValue: number;

    @Column({ nullable: true })
    public voucherIsPercent: boolean;

    @Column({ length: 20, nullable: true })
    public discountCode: string;

    @Column({ nullable: true })
    public discountValue: number;

    @Column('float', { nullable: true })
    public rating: number;

    @Column({ nullable: true })
    public note: string;

    @ManyToOne(_type => Store, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({name: 'storeId'})
    public store: Store;

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
