import { __ } from 'i18n';
import { Arg, Authorized, Float, Int, Mutation, Query } from 'type-graphql';
import { Permission } from '../entity/permission';
import { Store, timeScalar } from '../entity/store';
import { StoreService } from '../service/store.service';
import { StoreDishInput } from './InputTypes/storeDishInput';

export class StoreResolver {
    @Query(() => [Store])
    public async stores() {
        const stores = await Store.find({ relations: ['storeDishes'] });

        stores.map(item => {
            item.amountDishes = item.storeDishes.length;

            return item;
        });

        return stores;
    }

    @Mutation(() => Store)
    @Authorized([Permission.store.create])
    public async createStore(
        @Arg('name') name: string,
        @Arg('address') address: string,
        @Arg('hotline') hotline: string,
        @Arg('description', { nullable: true }) description: string,
        @Arg('logo', { nullable: true }) logo: string,
        @Arg('openTime', () => timeScalar, { nullable: true }) openTime: Date,
        @Arg('closeTime', () => timeScalar, { nullable: true }) closeTime: Date,
        @Arg('dishIds', () => [Int], { nullable: true }) dishIds: number[],
        @Arg('dishPrices', () => [Float], { nullable: true }) dishPrices: number[],
    ) {
        return await StoreService.create({
            name, address, hotline, description, logo, openTime, closeTime, dishIds, dishPrices
        });
    }

    @Mutation(() => Store)
    @Authorized([Permission.store.update])
    public async editStore(
        @Arg('id', () => Int) id: number,
        @Arg('name', { nullable: true }) name: string,
        @Arg('address', { nullable: true }) address: string,
        @Arg('hotline', { nullable: true }) hotline: string,
        @Arg('description', { nullable: true }) description: string,
        @Arg('logo', { nullable: true }) logo: string,
        @Arg('openTime', () => timeScalar, { nullable: true }) openTime: Date,
        @Arg('closeTime', () => timeScalar, { nullable: true }) closeTime: Date,
        @Arg('storeDishes', () => [StoreDishInput], { nullable: true }) storeDishes: StoreDishInput[],
    ) {
        return await StoreService.edit(id, {
            name, address, hotline, description, logo, openTime, closeTime, storeDishes
        });
    }

    @Query(() => Store)
    public async getStore(@Arg('id', () => Int) id: number) {
        return await StoreService.getOne(id, {
            withDishes: true, withDiscountCampaigns: true, withDiscountCodes: true, withUsers: true,
            withVoucherCodes: true, withWarehouses: true
        });
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.store.delete])
    public async deleteStore(@Arg('id', () => Int) id: number) {
        await StoreService.delete(id);

        return __('store.delete_success');
    }
}
