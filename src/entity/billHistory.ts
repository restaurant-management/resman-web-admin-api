import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Bill } from './bill';
import { BillDish } from './billDish';
import { User } from './user';

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

    @OneToMany(_type => BillDish, billDish => billDish.billHistory, { nullable: false })
    public dishes: BillDish[];
}
