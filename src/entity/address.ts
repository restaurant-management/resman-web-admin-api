import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer';

@ObjectType()
@Entity()
export class Address extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column()
    public address: string;

    @Field({ nullable: true })
    @Column('float', { nullable: true })
    public longitude: number;

    @Field({ nullable: true })
    @Column('float', { nullable: true })
    public latitude: number;

    @Field(() => Customer)
    @ManyToOne(_type => Customer, customer => customer.addresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    public customer: Customer;

    @Column()
    public customerId: number;
}
