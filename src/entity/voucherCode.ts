import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Store } from './store';

@Entity()
export class VoucherCode extends BaseEntity {
    @PrimaryColumn({ length: 10 })
    public code: string;

    @Column({ default: false })
    public isActive: boolean;

    /**
     * Whether this voucher value is percent or money.
     */
    @Column({ default: true })
    public isPercent: boolean;

    @Column({ length: 100 })
    public name: string;

    @Column({ nullable: true })
    public description: string;

    @Column({ nullable: true, length: 100 })
    public image: string;

    @Column('timestamp with time zone')
    public startAt: Date;

    @Column('timestamp with time zone')
    public endAt: Date;

    @Column('money', { nullable: true })
    public minBillPrice: number;

    /**
     *   Maximum price this discount can reduce for a bill.
     */
    @Column('money', { nullable: true })
    public maxPriceDiscount: number;

    @Column()
    public value: number;

    @ManyToMany(_type => Store, store => store.voucherCodes, { onDelete: 'CASCADE' })
    @JoinTable()
    public stores: Store[];
}
