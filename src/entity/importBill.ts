import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ImportBillStock } from './importBillStock';
import { User } from './user';
import { Warehouse } from './warehouse';

@ObjectType()
@Entity()
export class ImportBill extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public note: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp with time zone' })
    public createAt: Date;

    @Field()
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    public updateAt: Date;

    @OneToMany(() => ImportBillStock, stock => stock.importBill, { nullable: false })
    public stocks: ImportBillStock[];

    @Field(() => Warehouse)
    @ManyToOne(() => Warehouse, warehouse => warehouse.importBills,
        { nullable: false, onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'warehouseId' })
    public warehouse: Warehouse;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'userId' })
    public user: User;
}
