import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountCampaign } from './discountCampaign';
import { DiscountCode } from './discountCode';
import { Dish } from './dish';
import { StoreDish } from './storeDish';
import { User } from './user';
import { VoucherCode } from './voucherCode';
import { Warehouse } from './warehouse';

@Entity()
export class Store extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100 })
    public name: string;

    @Column({ nullable: true })
    public description: string;

    @Column({ nullable: true })
    public logo: string;

    @Column({ length: 200 })
    public address: string;

    @Column({ length: 20 })
    public hotline: string;

    @ManyToMany(() => User)
    public users: User[];

    @ManyToMany(() => DiscountCode)
    public discountCodes: DiscountCode[];

    @ManyToMany(() => VoucherCode)
    public voucherCodes: VoucherCode[];

    @ManyToMany(() => DiscountCampaign)
    public discountCampaigns: DiscountCampaign[];

    @OneToMany(() => StoreDish, dish => dish.store)
    public dishes: Dish[];

    @OneToMany(() => Warehouse, warehouse => warehouse.store)
    public warehouses: Warehouse[];
}
