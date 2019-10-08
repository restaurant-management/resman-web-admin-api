import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Bill } from './bill';
import { User } from './user';
import { BillDish } from './billDish';

@Entity()
export class BillHistory extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(_type => Bill, bill => bill.histories, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'billId' })
    public bill: Bill;

    @PrimaryColumn()
    public billId: number;

    @ManyToOne(_type => User, user => user.billHistories, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public user: User;

    @PrimaryColumn()
    public userId: number;

    @Column({ nullable: true })
    public description: string;

    @Column('time with time zone')
    public time: Date;

    @OneToMany(_type => BillDish, billDish => billDish.BillHistory, { nullable: false })
    public dishes: BillDish[];
}
