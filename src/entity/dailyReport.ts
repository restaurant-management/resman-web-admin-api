import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ImportBillStock } from './importBillStock';
import { User } from './user';
import { Warehouse } from './warehouse';

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
