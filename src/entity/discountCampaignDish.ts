import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DiscountCampaign } from './discountCampaign';
import { Dish } from './dish';

@Entity()
export class DiscountCampaignDish extends BaseEntity {
    @ManyToOne(() => DiscountCampaign, discountCampaign => discountCampaign.dishes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'discountCampaignId' })
    public discountCampaign: DiscountCampaign;

    @PrimaryColumn()
    public discountCampaignId: number;

    @ManyToOne(() => Dish, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dishId' })
    public dish: Dish;

    @PrimaryColumn()
    public dishId: number;

    @Column({ nullable: true })
    public discount: number;
}
