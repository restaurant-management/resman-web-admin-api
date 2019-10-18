import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DailyReport } from './dailyReport';
import { ImportBill } from './importBill';
import { Stock } from './stock';
import { Store } from './store';
import { User } from './user';

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

    @ManyToMany(() => User)
    public users: User[];

    @ManyToMany(() => Stock)
    @JoinTable()
    public stocks: Stock[];

    @OneToMany(() => ImportBill, importBill => importBill.warehouse)
    public importBills: ImportBill[];

    @OneToMany(() => DailyReport, dailyReport => dailyReport.warehouse)
    public dailyReports: DailyReport[];

    @ManyToOne(() => Store, store => store.warehouses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    public store: Store;
}
