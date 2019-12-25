import { Field, ID, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Stock } from './stock';
import { Warehouse } from './warehouse';

@ObjectType()
@Entity()
export class WarehouseStock extends BaseEntity {
    @ManyToOne(() => Warehouse, warehouse => warehouse.warehouseStocks,
        { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    public warehouse: Warehouse;

    @Field(() => ID)
    @PrimaryColumn()
    public warehouseId: number;

    @Field(() => Stock, { nullable: true })
    @ManyToOne(() => Stock, { nullable: false, onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'stockId' })
    public stock: Stock;

    @Field(() => ID)
    @PrimaryColumn()
    public stockId: number;

    @Field(() => Int, { defaultValue: 0 })
    @Column({ default: 0 })
    public quantity: number;
}
