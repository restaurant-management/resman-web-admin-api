import { __ } from 'i18n';
import { getManager } from 'typeorm';
import { DiscountCampaign } from '../entity/discountCampaign';
import { DiscountCampaignDish } from '../entity/discountCampaignDish';
import { Dish } from '../entity/dish';
import { DishService } from './dish.service';
import { StoreService } from './store.service';

class DiscountCampaignService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const discountCampaign = await DiscountCampaign.find({ take, skip, order });

        return discountCampaign;
    }

    public async create(data: {
        name: string, startAt: Date, endAt: Date, defaultDiscount: number, storeIds: number[],
        dishIds?: number[], discounts?: number[], description?: string, banner?: string
    }) {
        if (data.discounts.length !== data.dishIds.length) {
            throw new Error(__('discount_campaign.dishIds_length_have_to_equal_discounts_length'));
        }

        const stores = [];
        for (const storeId of data.storeIds) {
            stores.push(await StoreService.getOne(storeId));
        }

        const dishes: Dish[] = [];
        for (const dishId of data.dishIds) {
            dishes.push(await DishService.getOne(dishId));
        }

        const newDiscountCampaign = new DiscountCampaign();
        newDiscountCampaign.name = data.name;
        newDiscountCampaign.startAt = data.startAt;
        newDiscountCampaign.endAt = data.endAt;
        newDiscountCampaign.description = data.description;
        newDiscountCampaign.defaultDiscount = data.defaultDiscount;
        newDiscountCampaign.banner = data.banner;
        newDiscountCampaign.stores = stores;

        const discountCampaign = await newDiscountCampaign.save();
        if (!discountCampaign) { throw new Error(__('discount_campaign.create_fail')); }

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < dishes.length; i++) {
            const discountCampaignDish = new DiscountCampaignDish();
            discountCampaignDish.discount = data.discounts[i];
            discountCampaignDish.dish = dishes[i];
            discountCampaignDish.discountCampaign = newDiscountCampaign;
            await discountCampaignDish.save();
        }

        return await this.getOne(newDiscountCampaign.id, { withDishes: true, withStores: true });
    }

    public async edit(id: number, data: {
        name?: string, startAt?: Date, endAt?: Date, defaultDiscount?: number, storeIds?: number[],
        dishIds?: number[], discounts?: number[], description?: string, banner?: string
    }) {
        const discountCampaign = await this.getOne(id, { withStores: true, withDishes: false });

        // List to contain dishes are not in new dish list.
        const discountCampaignDishToRemove: DiscountCampaignDish[] = [];

        if (data.name) { discountCampaign.name = data.name; }
        if (data.startAt) { discountCampaign.startAt = data.startAt; }
        if (data.endAt) { discountCampaign.endAt = data.endAt; }
        if (data.defaultDiscount) { discountCampaign.defaultDiscount = data.defaultDiscount; }
        if (data.description) { discountCampaign.description = data.description; }
        if (data.banner) { discountCampaign.banner = data.banner; }
        if (data.storeIds) {
            const stores = [];
            for (const storeId of data.storeIds) {
                stores.push(await StoreService.getOne(storeId));
            }
            discountCampaign.stores = stores;
        }

        if (data.dishIds) {
            const dishIds = data.dishIds;

            // Check whether dish is existed
            let dishes: Dish[] = [];
            for (const dishId of dishIds) {
                dishes.push(await DishService.getOne(dishId));
            }

            const discountCampaignDishes = await DiscountCampaignDish.find({
                where: { discountCampaignId: discountCampaign.id }
            });
            discountCampaignDishes.filter((item) => {
                // Remove dish if it is not in new list dish.
                if (dishes.findIndex(i => i.id === item.dishId) === -1) {
                    discountCampaignDishToRemove.push(item);

                    return false;
                }

                // Remove dish in old list to create dishes in new list.
                dishes = dishes.filter(i => i.id !== item.dishId);

                // Accept dish if it's in new list.
                return true;
            });

            for (let i = 0; i < dishes.length; i++) {
                const discountCampaignDish = new DiscountCampaignDish();
                discountCampaignDish.discount = data.discounts[i];
                discountCampaignDish.dishId = dishes[i].id;
                discountCampaignDish.discountCampaignId = discountCampaign.id;
                await getManager().getRepository(DiscountCampaignDish).save(discountCampaignDish);
            }
        }

        const saved = await discountCampaign.save();

        // Remove dishes are not in new dish list.
        for (const item of discountCampaignDishToRemove) {
            await item.remove();
        }

        return await this.getOne(saved.id, { withDishes: true, withStores: true });
    }

    public async delete(id: number) {
        const discountCampaign = await this.getOne(id);

        if (!discountCampaign) {
            throw new Error(__('discount_campaign.discount_campaign_not_found'));
        }

        await discountCampaign.remove();
    }

    public async getOne(id: number, options: { withStores?: boolean, withDishes?: boolean } = {}) {
        const relations = [];
        if (options.withStores) { relations.push('stores'); }
        if (options.withDishes) { relations.push('dishes'); }

        const discountCampaign =
            await DiscountCampaign.findOne(id, options.withStores ? { relations } : {});

        if (!discountCampaign) {
            throw new Error(__('discount_campaign.discount_campaign_not_found'));
        }

        return discountCampaign;
    }
}

const discountCampaignService = new DiscountCampaignService();

export { discountCampaignService as DiscountCampaignService };
