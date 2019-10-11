import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Store } from './store';

@Entity()
export class DiscountCode extends BaseEntity {
    @PrimaryColumn({ length: 10 })
    public code: string;

    @Column({ default: false })
    public isActive: boolean;

    @Column({ length: 100 })
    public name: string;

    @Column({ nullable: true })
    public description: string;

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

    @Column({ nullable: true })
    public maxNumber: number;

    @Column()
    public discount: number;

    @ManyToMany(() => Store)
    @JoinTable()
    public stores: Store[];
}
