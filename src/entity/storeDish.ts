import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Dish } from './dish';
import { Store } from './store';

@Entity()
export class StoreDish extends BaseEntity {
    @ManyToOne(() => Store, store => store.storeDishes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    public store: Store;

    @PrimaryColumn()
    public storeId: number;

    @ManyToOne(() => Dish, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dishId' })
    public dish: Dish;

    @PrimaryColumn()
    public dishId: number;

    @Column({ type: 'float', nullable: true })
    public price: number;
}
