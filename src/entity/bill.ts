import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SoftDeleteEntity } from '../lib/softDeleteEntity';
import { BillHistory } from './billHistory';
import { Customer } from './customer';
import { Store } from './store';
import { User } from './user';

@Entity()
export class Bill extends SoftDeleteEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public tableNumber: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    public insertAt: Date;

    @Column({ type: 'timestamp with time zone' })
    public createAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public prepareAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public collectAt: Date;

    @Column('money', { nullable: true })
    public collectValue: number;

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

    @ManyToOne(_type => User, { nullable: false, onDelete: 'NO ACTION' })
    public createBy: User;

    @ManyToOne(_type => User, { nullable: true, onDelete: 'NO ACTION' })
    public prepareBy: User;

    @ManyToOne(_type => User, { nullable: true, onDelete: 'NO ACTION' })
    public collectBy: User;

    @ManyToOne(_type => Customer, customer => customer.bills, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'customerId' })
    public customer: Customer;

    @OneToMany(_type => BillHistory, history => history.bill)
    public histories: BillHistory[];
}
