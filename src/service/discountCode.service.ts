import { __ } from 'i18n';
import { Bill } from '../entity/bill';
import { DeliveryBill } from '../entity/deliveryBill';
import { DiscountCode } from '../entity/discountCode';
import { User } from '../entity/user';
import { StoreService } from './store.service';

class DiscountCodeService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const discountCode = await DiscountCode.find({ take, skip, order, relations: ['stores'] });

        return discountCode;
    }

    public async getAllByUser(user: User, length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const discountCodes = await DiscountCode.find({ order, relations: ['stores'] });

        return discountCodes.filter(i =>
            i.stores.findIndex(store => user.stores.findIndex(userStore => userStore.id === store.id) >= 0) >= 0)
            .filter((_store, index) => index >= skip && index < (take ? skip + take : discountCodes.length));
    }

    public async create(data: {
        code: string, name: string, startAt: Date, endAt: Date, discount: number, storeIds: number[]
        description?: string, minBillPrice?: number, maxPriceDiscount?: number, maxNumber?: number, isActive?: boolean
    }) {
        // Generate unique code
        if (await DiscountCode.findOne(data.code)) {
            throw new Error(__('discount_code.code_existed'));
        }

        const stores = [];
        for (const storeId of data.storeIds) {
            stores.push(await StoreService.getOne(storeId));
        }

        const newDiscountCode = new DiscountCode();
        newDiscountCode.code = data.code;
        newDiscountCode.name = data.name;
        newDiscountCode.discount = data.discount;
        newDiscountCode.startAt = data.startAt;
        newDiscountCode.endAt = data.endAt;
        newDiscountCode.description = data.description;
        newDiscountCode.minBillPrice = data.minBillPrice;
        newDiscountCode.maxPriceDiscount = data.maxPriceDiscount;
        newDiscountCode.isActive = data.isActive;
        newDiscountCode.maxNumber = data.maxNumber;
        newDiscountCode.stores = stores;

        const discountCode = await newDiscountCode.save();
        if (!discountCode) { throw new Error(__('discount_code.create_fail')); }

        return await this.getOne(discountCode.code);
    }

    public async edit(code: string, data: {
        name?: string, startAt?: Date, endAt?: Date, discount?: number, storeIds?: number[]
        description?: string, minBillPrice?: number, maxPriceDiscount?: number, maxNumber?: number, isActive?: boolean
    }) {
        const discountCode = await this.getOne(code);

        if (data.name) { discountCode.name = data.name; }
        if (data.startAt) { discountCode.startAt = data.startAt; }
        if (data.endAt) { discountCode.endAt = data.endAt; }
        if (data.discount) { discountCode.discount = data.discount; }
        if (data.storeIds) {
            const stores = [];
            for (const storeId of data.storeIds) {
                stores.push(await StoreService.getOne(storeId));
            }
            discountCode.stores = stores;
        }
        if (data.description) { discountCode.description = data.description; }
        if (data.minBillPrice) { discountCode.minBillPrice = data.minBillPrice; }
        if (data.maxPriceDiscount) { discountCode.maxPriceDiscount = data.maxPriceDiscount; }
        if (data.maxNumber) { discountCode.maxNumber = data.maxNumber; }
        if (data.isActive) { discountCode.isActive = data.isActive; }

        return await this.getOne((await discountCode.save()).code);
    }

    public async delete(code: string) {
        const discountCode = await this.getOne(code);

        if (!discountCode) {
            throw new Error(__('discount_code.discount_code_not_found'));
        }

        await discountCode.remove();
    }

    public async getOne(code: string, options: {
        withStores: boolean
    } = { withStores: true }) {
        const discountCode = await DiscountCode.findOne(code, options.withStores ? { relations: ['stores'] } : {});

        if (!discountCode) {
            throw new Error(__('discount_code.discount_code_not_found'));
        }

        return discountCode;
    }

    /**
     * @param storeId If you have check code enable for this store. 
     */
    public async isValid(code: string, other?: { storeId?: number, billPrice?: number }) {
        const discountCode = await this.getOne(code);

        if (!discountCode.isActive) {
            throw new Error(__('discount_code.no_longer_valid'));
        }

        let amountNumber = 0;
        amountNumber += await Bill.findAndCount({ where: { discountCode: code } })[1];
        amountNumber += await DeliveryBill.findAndCount({ where: { discountCode: code } })[1];

        if (amountNumber > discountCode.maxNumber) {
            throw new Error(__('discount_code.out_of_stock'));
        }

        if (other?.storeId && discountCode.stores.findIndex(item => item.id === other.storeId) < 0) {
            throw new Error(__('discount_code.not_apply_for_this_store'));
        }

        if (other?.billPrice && other.billPrice < discountCode.minBillPrice) {
            throw new Error(__('discount_code.not_apply_for_this_price'));
        }
    }
}

const discountCodeService = new DiscountCodeService();

export { discountCodeService as DiscountCodeService };
