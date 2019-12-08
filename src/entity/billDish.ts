import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BillHistory } from './billHistory';
import { Dish } from './dish';

@Entity()
export class BillDish extends BaseEntity {
    @ManyToOne(_type => BillHistory, history => history.dishes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'billHistoryId' })
    public billHistory: BillHistory;

    @PrimaryColumn()
    public billHistoryId: number;

    @ManyToOne(_type => Dish, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'dishId' })
    public dish: Dish;

    @PrimaryColumn()
    public dishId: number;

    @Column({ nullable: true })
    public note: string;

    @Column('timestamp with time zone', { nullable: true })
    public preparedAt: Date;

    @Column('timestamp with time zone', { nullable: true })
    public deliveryAt: Date;

    @Column('smallint', { default: 1 })
    public quantity: number;

    @Column('float', { nullable: true })
    public price: number;
}
