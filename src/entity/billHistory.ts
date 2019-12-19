import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bill } from './bill';
import { BillDish } from './billDish';
import { User } from './user';

@ObjectType()
@Entity()
export class BillHistory extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field(() => Bill, { nullable: true })
    @ManyToOne(_type => Bill, bill => bill.histories, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'billId' })
    public bill: Bill;

    @Field(() => ID)
    @Column()
    public billId: number;

    @Field(() => User)
    @ManyToOne(_type => User, user => user.billHistories, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public user: User;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public description: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp with time zone' })
    public createAt: Date;

    @Field(() => [BillDish], { nullable: true })
    @OneToMany(_type => BillDish, billDish => billDish.billHistory, { nullable: false, eager: true })
    public dishes: BillDish[];
}
