import { MaxLength } from 'class-validator';
import { Field, Float, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Store } from './store';

@ObjectType()
@Entity()
export class DiscountCode extends BaseEntity {
    @Field(() => String)
    @MaxLength(10)
    @PrimaryColumn({ length: 10 })
    public code: string;

    @Field(() => Boolean)
    @Column({ default: false })
    public isActive: boolean;

    @Field(() => String)
    @MaxLength(100)
    @Column({ length: 100 })
    public name: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public description: string;

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

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    public maxNumber: number;

    @Field(() => Float, { nullable: true })
    @Column()
    public discount: number;

    @Field(() => [Store], { nullable: true })
    @ManyToMany(_type => Store, store => store.discountCodes, { onDelete: 'CASCADE' })
    @JoinTable()
    public stores: Store[];
}
