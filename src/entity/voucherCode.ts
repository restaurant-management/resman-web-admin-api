import { MaxLength } from 'class-validator';
import { Field, Float, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Store } from './store';

@ObjectType()
@Entity()
export class VoucherCode extends BaseEntity {
    @Field()
    @MaxLength(10)
    @PrimaryColumn({ length: 10 })
    public code: string;

    @Field(() => Boolean)
    @Column({ default: false })
    public isActive: boolean;

    /**
     * Whether this voucher value is percent or money.
     */
    @Field(() => Boolean)
    @Column({ default: true })
    public isPercent: boolean;

    @Field()
    @MaxLength(100)
    @Column({ length: 100 })
    public name: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public description: string;

    @Field({ nullable: true })
    @MaxLength(100)
    @Column({ nullable: true, length: 100 })
    public image: string;

    @Field()
    @Column('timestamp with time zone')
    public startAt: Date;

    @Field()
    @Column('timestamp with time zone')
    public endAt: Date;

    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    public minBillPrice: number;

    /**
     *   Maximum price this discount can reduce for a bill.
     */
    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    public maxPriceDiscount: number;

    @Field()
    @Column()
    public value: number;

    @Field(() => [Store])
    @ManyToMany(_type => Store, store => store.voucherCodes, { onDelete: 'CASCADE' })
    @JoinTable()
    public stores: Store[];
}
