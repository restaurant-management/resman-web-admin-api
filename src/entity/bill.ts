import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BillHistory } from './billHistory';
import { Customer } from './customer';
import { User } from './user';

@Entity()
export class Bill extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public tableNumber: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
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

    @Column({ length: 20, nullable: true })
    public discountCode: string;

    @Column({ nullable: true })
    public discountValue: number;

    @Column('float', { nullable: true })
    public rate: number;

    @Column({ nullable: true })
    public note: string;

    @ManyToOne(_type => User, { nullable: false, onDelete: 'NO ACTION' })
    public createBy: User;

    @ManyToOne(_type => User, { nullable: true, onDelete: 'NO ACTION' })
    public prepareBy: User;

    @ManyToOne(_type => User, { nullable: true, onDelete: 'NO ACTION' })
    public collectBy: User;

    @ManyToOne(_type => Customer, customer => customer.bills, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'customerId' })
    public customer: Customer;

    @Column({ nullable: true })
    public customerId: number;

    @OneToMany(_type => BillHistory, history => history.bill)
    public histories: BillHistory[];
}
