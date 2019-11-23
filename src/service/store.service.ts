import { __ } from 'i18n';
import { Store } from '../entity/store';

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

    public async getOne(id: number) {
        const store = await Store.findOne(id);

        if (!store) {
            throw new Error(__('store.store_not_found'));
        }

        return store;
    }
}

const storeService = new StoreService();

export { storeService as StoreService };
