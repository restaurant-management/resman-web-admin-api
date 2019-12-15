import { GraphQLScalarType, Kind } from 'graphql';
import moment from 'moment';
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountCampaign } from './discountCampaign';
import { DiscountCode } from './discountCode';
import { StoreDish } from './storeDish';
import { User } from './user';
import { VoucherCode } from './voucherCode';
import { Warehouse } from './warehouse';

export const timeScalar = new GraphQLScalarType({
    name: 'time',
    description: 'Time use for store open time and close time',
    parseValue(value: string) {
        return moment(value, 'HH:mm:ss').toDate();
    },
    serialize(value: Date) {
        return moment(value, 'HH:mm:ss').format('HH:mm:ss');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return moment(ast.value, 'HH:mm:ss').toDate();
        }

        return null;
    }
});

@ObjectType()
@Entity()
export class Store extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column({ length: 100 })
    public name: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public description: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public logo: string;

    @Field({ nullable: true })
    @Column({ length: 200 })
    public address: string;

    @Field()
    @Column({ length: 20 })
    public hotline: string;

    @Field()
    @Column('float', { default: 0 })
    public rating: number;

    @Field(() => timeScalar, { nullable: true })
    @Column('time', { nullable: true })
    public openTime: Date;

    @Field(() => timeScalar, { nullable: true })
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
