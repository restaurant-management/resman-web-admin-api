import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer';

@Entity()
export class Address extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public address: string;

    @ManyToOne(_type => Customer, customer => customer.addresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    public customer: Customer;

    @Column()
    public customerId: number;
}
