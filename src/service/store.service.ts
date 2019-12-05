import { __ } from 'i18n';
import { Dish } from '../entity/dish';
import { Permission } from '../entity/permission';
import { Store } from '../entity/store';
import { StoreDish } from '../entity/storeDish';
import { User } from '../entity/user';
import { Authorization } from '../middleware/authorization';
import { DishService } from './dish.service';

class StoreService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const stores = await Store.find({ take, skip, order, relations: ['storeDishes'] });

        for (const store of stores) {
            store['amountDishes'] = store.storeDishes.length;
            delete store.storeDishes;
        }

        return stores;
    }

    public async create(data: {
        name: string, address: string, hotline: string, description?: string, logo?: string,
        openTime?: Date, closeTime?: Date, dishIds?: number[], dishPrices?: number[]
    }) {
        if (data.dishIds && data.dishPrices && data.dishIds.length !== data.dishPrices.length) {
            throw new Error('store.dishIds_length_not_same_dishPrices_length');
        }

        const newStore = new Store();
        newStore.name = data.name;
        newStore.address = data.address;
        newStore.hotline = data.hotline;
        newStore.description = data.description;
        newStore.logo = data.logo;
        if (data.openTime) { newStore.openTime = new Date(data.openTime); }
        if (data.closeTime) { newStore.closeTime = new Date(data.closeTime); }
        const dishes: Dish[] = [];
        if (data.dishIds) {
            for (const dishId of data.dishIds) {
                dishes.push(await DishService.getOne(dishId));
            }
        }

        const store = await newStore.save({ reload: true });
        if (!store) { throw new Error(__('store.create_fail')); }

        if (data.dishIds) {
            for (const [index, dish] of dishes.entries()) {
                const storeDish = new StoreDish();
                storeDish.dish = dish;
                storeDish.price = data.dishPrices[index];
            }
        }

        return store;
    }

    public async edit(id: number, data: {
        name?: string, address?: string, hotline?: string, description?: string, logo?: string,
        openTime?: Date, closeTime?: Date
    }) {
        const store = await Store.findOne(id);

        if (data.name) { store.name = data.name; }
        if (data.address) { store.address = data.address; }
        if (data.hotline) { store.hotline = data.hotline; }
        if (data.description) { store.description = data.description; }
        if (data.logo) { store.logo = data.logo; }
        if (data.openTime) { store.openTime = data.openTime; }
        if (data.closeTime) { store.closeTime = data.closeTime; }

        return await store.save();
    }

    public async delete(id: number) {
        const store = await Store.findOne(id);

        if (!store) {
            throw new Error(__('store.store_not_found'));
        }

        await store.remove();
    }

    public async getOne(id: number, options?: {
        withUsers?: boolean;
        withDiscountCodes?: boolean;
        withVoucherCodes?: boolean;
        withDiscountCampaigns?: boolean;
        withDishes?: boolean;
        withWarehouses?: boolean;
    }) {
        const relations = [];
        if (options?.withUsers) { relations.push('users'); }
        if (options?.withDiscountCodes) { relations.push('discountCodes'); }
        if (options?.withVoucherCodes) { relations.push('voucherCodes'); }
        if (options?.withDiscountCampaigns) { relations.push('discountCampaigns'); }
        if (options?.withWarehouses) { relations.push('warehouses'); }
        if (options?.withDishes) { relations.push('storeDishes'); }

        const store = await Store.findOne(id, { relations });

        if (!store) {
            throw new Error(__('store.store_not_found'));
        }

        if (options?.withDishes) {
            const dishes = [];
            for (const storeDish of store.storeDishes) {
                const dish = await DishService.getOne(storeDish.dishId);

                // Calculate price
                const price = storeDish.price || dish.defaultPrice;

                delete dish.defaultPrice;
                dish['price'] = price;

                dishes.push(dish);
            }

            delete store.storeDishes;
            store['dishes'] = dishes;
        }

        return store;
    }

    public async getOneWithAuthorization(id: number, user: User) {
        return this.getOne(id, {
            withUsers: Authorization(user, [Permission.user.list], false),
            withDiscountCampaigns: Authorization(user, [Permission.discountCampaign.list], false),
            withDiscountCodes: Authorization(user, [Permission.discountCode.list], false),
            withDishes: true,
            withVoucherCodes: Authorization(user, [Permission.voucherCode.list], false),
            withWarehouses: Authorization(user, [Permission.warehouse.list], false),
        });
    }

    public async getDishes(id: number) {
        const store = await this.getOne(id);

        return store;
    }
}

const storeService = new StoreService();

export { storeService as StoreService };

