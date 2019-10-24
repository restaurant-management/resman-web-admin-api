import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Stock } from './stock';
import { Warehouse } from './warehouse';

@Entity()
export class WarehouseStock extends BaseEntity {
    @ManyToOne(() => Warehouse, warehouse => warehouse.warehouseStocks, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    public warehouse: Warehouse;

    @PrimaryColumn()
    public warehouseId: number;

    @ManyToOne(() => Stock, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'stockId' })
    public stock: Stock;

    @PrimaryColumn()
    public stockId: number;

    @Column({ nullable: true })
    public price: number;
}
