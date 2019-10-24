import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DailyReport } from './dailyReport';
import { ImportBill } from './importBill';
import { Store } from './store';
import { User } from './user';
import { WarehouseStock } from './warehouseStock';

@Entity()
export class Warehouse extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100 })
    public name: string;

    @Column({ nullable: true })
    public description: string;

    @Column({ length: 200 })
    public address: string;

    @Column({ length: 20 })
    public hotline: string;

    @ManyToMany(() => User, user => user.warehouses)
    public users: User[];

    @OneToMany(_type => WarehouseStock, warehouseStock => warehouseStock.warehouse)
    public warehouseStocks: WarehouseStock[];

    @OneToMany(() => ImportBill, importBill => importBill.warehouse)
    public importBills: ImportBill[];

    @OneToMany(() => DailyReport, dailyReport => dailyReport.warehouse)
    public dailyReports: DailyReport[];

    @ManyToOne(() => Store, store => store.warehouses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    public store: Store;
}
