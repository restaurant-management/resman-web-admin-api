import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Dish } from './dish';
import { Store } from './store';

@ObjectType()
@Entity()
export class StoreDish extends BaseEntity {
    @ManyToOne(() => Store, store => store.storeDishes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    public store: Store;

    @Field()
    @PrimaryColumn()
    public storeId: number;

    @Field(() => Dish)
    @ManyToOne(() => Dish, { nullable: false, onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'dishId' })
    public dish: Dish;

    @Field()
    @PrimaryColumn()
    public dishId: number;

    @Field({ nullable: true })
    @Column({ type: 'float', nullable: true })
    public price: number;
}
