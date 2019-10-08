import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ImportBillStock } from './importBillStock';
import { Warehouse } from './warehouse';
import { User } from './user';

@Entity()
export class DailyReport extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true })
    public note: string;

    @CreateDateColumn()
    public createAt: Date;

    @UpdateDateColumn()
    public updateAt: Date;

    // TODO change
    @OneToMany(() => ImportBillStock, stock => stock.importBill, { nullable: false, onDelete: 'NO ACTION' })
    public stocks: ImportBillStock[];

    @ManyToOne(() => Warehouse, warehouse => warehouse.dailyReports, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    public warehouse: Warehouse;

    @ManyToOne(() => User, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'userId' })
    public user: User;
}
