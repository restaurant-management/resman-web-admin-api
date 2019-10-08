import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Stock } from './stock';
import { DailyReport } from './dailyReport';
import { Store } from './store';

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
    users: User[];

    @ManyToMany(() => Stock)
    @JoinTable()
    stocks: Stock[];

    @OneToMany(() => DailyReport, dailyReport => dailyReport.warehouse)
    public dailyReports: DailyReport[];

    @ManyToOne(() => Store, store => store.warehouses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    public store: Store;
}
