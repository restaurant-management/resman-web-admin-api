import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountCampaign } from './discountCampaign';
import { DiscountCode } from './discountCode';
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

    @Column('float', {default: 0})
    public rating: number;

    @Column('time', { nullable: true })
    public openTime: Date;

    @Column('time', { nullable: true })
    public closeTime: Date;

    @ManyToMany(_type => User, user => user.stores)
    public users: User[];

    @ManyToMany(_type => DiscountCode, discountCode => discountCode.stores)
    public discountCodes: DiscountCode[];

    @ManyToMany(_type => VoucherCode, voucherCode => voucherCode.stores)
    public voucherCodes: VoucherCode[];

    @ManyToMany(_type => DiscountCampaign, discountCampaign => discountCampaign.stores)
    public discountCampaigns: DiscountCampaign[];

    @OneToMany(_type => StoreDish, dish => dish.store)
    public storeDishes: StoreDish[];

    @OneToMany(_type => Warehouse, warehouse => warehouse.store)
    public warehouses: Warehouse[];
}
