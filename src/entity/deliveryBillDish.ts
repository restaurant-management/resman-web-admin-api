import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DeliveryBill } from './deliveryBill';
import { Dish } from './dish';

@Entity()
export class DeliveryBillDish extends BaseEntity {
    @ManyToOne(() => Dish, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({name: 'dishId'})
    public dish: Dish;

    @PrimaryColumn()
    public dishId: number;

    @ManyToOne(() => DeliveryBill, deliveryBill => deliveryBill.dishes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({name: 'deliveryBillId'})
    public deliveryBill: DeliveryBill;

    @PrimaryColumn()
    public deliveryBillId: number;

    @Column({ length: 100 })
    public name: string;

    @Column({ nullable: true })
    public note: string;

    @Column('smallint', { default: 1 })
    public quantity: number;

    @Column('money', { nullable: true })
    public price: number;
}
