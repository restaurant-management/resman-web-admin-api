import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DailyReport } from './dailyReport';
import { Stock } from './stock';

@Entity()
export class DailyReportStock extends BaseEntity {
    @ManyToOne(() => DailyReport, bill => bill.stocks, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dailyReportId' })
    public dailyReport: DailyReport;

    @PrimaryColumn()
    public dailyReportId: number;

    @ManyToOne(() => Stock, { nullable: false, onDelete: 'NO ACTION' })
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
