import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DailyReportStock } from './dailyReportStock';
import { User } from './user';
import { Warehouse } from './warehouse';

@Entity()
export class DailyReport extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true })
    public note: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    public createAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    public updateAt: Date;

    @OneToMany(() => DailyReportStock, stock => stock.dailyReport, { nullable: false, onDelete: 'NO ACTION' })
    public stocks: DailyReportStock[];

    @ManyToOne(() => Warehouse, warehouse => warehouse.dailyReports, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    public warehouse: Warehouse;

    @ManyToOne(() => User, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'userId' })
    public user: User;
}
