import { Field, ID, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DiscountCampaign } from './discountCampaign';
import { Dish } from './dish';

@ObjectType()
@Entity()
export class DiscountCampaignDish extends BaseEntity {
    @Field(() => DiscountCampaign)
    @ManyToOne(() => DiscountCampaign, discountCampaign => discountCampaign.dishes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'discountCampaignId' })
    public discountCampaign: DiscountCampaign;

    @Field(() => ID)
    @PrimaryColumn()
    public discountCampaignId: number;

    @Field(() => Dish, { nullable: true })
    @ManyToOne(() => Dish, { nullable: false, onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'dishId' })
    public dish: Dish;

    @Field(() => ID)
    @PrimaryColumn()
    public dishId: number;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    public discount: number;
}
