import { __ } from 'i18n';
import { Store } from '../entity/store';
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

    public async create(name: string, address: string, hotline: string, description?: string, logo?: string) {
        const newStore = new Store();
        newStore.name = name;
        newStore.address = address;
        newStore.hotline = hotline;
        if (description) { newStore.description = description; }
        if (logo) { newStore.logo = logo; }

        const store = await newStore.save({ reload: true });
        if (!store) { throw new Error(__('store.create_fail')); }

        return store;
    }

    public async edit(id: number, name?: string, address?: string, hotline?: string, description?: string,
        logo?: string) {
        const store = await Store.findOne(id);

        if (name) { store.name = name; }
        if (address) { store.address = address; }
        if (hotline) { store.hotline = hotline; }
        if (description) { store.description = description; }
        if (logo) { store.logo = logo; }

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
        if (options.withUsers) { relations.push('users'); }
        if (options.withDiscountCodes) { relations.push('discountCodes'); }
        if (options.withVoucherCodes) { relations.push('voucherCodes'); }
        if (options.withDiscountCampaigns) { relations.push('discountCampaigns'); }
        if (options.withWarehouses) { relations.push('warehouses'); }
        if (options.withDishes) { relations.push('storeDishes'); }

        const store = await Store.findOne(id, { relations });

        if (!store) {
            throw new Error(__('store.store_not_found'));
        }

        if (options.withDishes) {
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

    public async getDishes(id: number) {
        const store = await this.getOne(id);

        return store;
    }
}

const storeService = new StoreService();

export { storeService as StoreService };
