import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user';
import { DiscountCode } from './discountCode';
import { VoucherCode } from './voucherCode';
import { DiscountCampaign } from './discountCampaign';
import { StoreDish } from './storeDish';
import { Dish } from './dish';
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
    users: User[];

    @ManyToMany(() => DiscountCode)
    discountCodes: DiscountCode[];

    @ManyToMany(() => VoucherCode)
    voucherCodes: VoucherCode[];

    @ManyToMany(() => DiscountCampaign)
    discountCampaigns: DiscountCampaign[];

    @OneToMany(() => StoreDish, dish => dish.store)
    public dishes: Dish[];

    @OneToMany(() => Warehouse, warehouse => warehouse.store)
    public warehouses: Warehouse[];
}
