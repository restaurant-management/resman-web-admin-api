import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

    @Column()
    public billId: number;

    @ManyToOne(_type => User, user => user.billHistories, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public user: User;

    @Column({ nullable: true })
    public description: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    public createAt: Date;

    @OneToMany(_type => BillDish, billDish => billDish.billHistory, { nullable: false })
    public dishes: BillDish[];
}
