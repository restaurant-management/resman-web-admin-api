import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ImportBill } from './importBill';
import { Stock } from './stock';

@Entity()
export class ImportBillStock extends BaseEntity {
    @ManyToOne(() => ImportBill, bill => bill.stocks, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'importBillId' })
    public importBill: ImportBill;

    @PrimaryColumn()
    public importBillId: number;

    @ManyToOne(() => Stock, { nullable: true })
    @JoinColumn({ name: 'stockId' })
    public stock: Stock;

    @PrimaryColumn()
    public stockId: number;

    @Column({ nullable: true })
    public note: string;

    @Column('smallint', { default: 1 })
    public quantity: number;

    @Column('money', { nullable: true })
    public price: number;
}
