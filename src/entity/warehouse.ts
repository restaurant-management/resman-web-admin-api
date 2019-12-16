import { MaxLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DailyReport } from './dailyReport';
import { ImportBill } from './importBill';
import { Store } from './store';
import { User } from './user';
import { WarehouseStock } from './warehouseStock';

@ObjectType()
@Entity()
export class Warehouse extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column({ length: 100 })
    public name: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public description: string;

    @Field()
    @MaxLength(200)
    @Column({ length: 200 })
    public address: string;

    @Field()
    @MaxLength(20)
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

    @Field(() => Store, { nullable: true })
    @ManyToOne(() => Store, store => store.warehouses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    public store: Store;
}
