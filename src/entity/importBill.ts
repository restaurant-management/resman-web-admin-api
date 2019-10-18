import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ImportBillStock } from './importBillStock';
import { User } from './user';
import { Warehouse } from './warehouse';

@Entity()
export class ImportBill extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true })
    public note: string;

    @CreateDateColumn()
    public createAt: Date;

    @UpdateDateColumn()
    public updateAt: Date;

    @OneToMany(() => ImportBillStock, stock => stock.importBill, { nullable: false })
    public stocks: ImportBillStock[];

    @ManyToOne(() => Warehouse, warehouse => warehouse.importBills, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    public warehouse: Warehouse;

    @ManyToOne(() => User, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'userId' })
    public user: User;
}
