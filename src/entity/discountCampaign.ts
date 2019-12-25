import { MaxLength } from 'class-validator';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountCampaignDish } from './discountCampaignDish';
import { Store } from './store';

@ObjectType()
@Entity()
export class DiscountCampaign extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @MaxLength(100)
    @Column({ length: 100 })
    public name: string;

    @Field()
    @Column({ nullable: true })
    public description: string;

    @Field({ nullable: true })
    @MaxLength(100)
    @Column({ nullable: true, length: 100 })
    public banner: string;

    @Field()
    @Column('timestamp with time zone')
    public startAt: Date;

    @Field()
    @Column('timestamp with time zone')
    public endAt: Date;

    @Field(() => Int)
    @Column()
    public defaultDiscount: number;

    @Field(() => Store)
    @ManyToMany(_type => Store, store => store.discountCampaigns)
    @JoinTable()
    public stores: Store[];

    @Field(() => [DiscountCampaignDish], { nullable: true })
    @OneToMany(() => DiscountCampaignDish, dish => dish.discountCampaign, { nullable: false })
    public dishes: DiscountCampaignDish[];
}
