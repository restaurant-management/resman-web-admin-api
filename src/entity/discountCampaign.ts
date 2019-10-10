import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Store } from './store';
import { DiscountCampaignDish } from './discountCampaignDish';

@Entity()
export class DiscountCampaign extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100 })
    public name: string;

    @Column({ nullable: true })
    public description: string;

    @Column({ nullable: true, length: 100 })
    public banner: string;

    @Column('timestamp with time zone')
    public startAt: Date;

    @Column('timestamp with time zone')
    public endAt: Date;

    @Column()
    public defaultDiscount: number;

    @ManyToMany(() => Store)
    @JoinTable()
    stores: Store[];

    @OneToMany(() => DiscountCampaignDish, dish => dish.discountCampaign, { nullable: false })
    public dishes: DiscountCampaignDish[];
}
