import { __ } from 'i18n';
import { User } from '../entity/user';
import { VoucherCode } from '../entity/voucherCode';
import { RandomCode } from '../helper/randomCode';
import { StoreService } from './store.service';

class VoucherCodeService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const voucherCode = await VoucherCode.find({ take, skip, order });

        return voucherCode;
    }

    public async getAllByUser(user: User, length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const voucherCodes = await VoucherCode.find({ order, relations: ['stores'] });

        return voucherCodes.filter(i =>
            i.stores.findIndex(store => user.stores.findIndex(userStore => userStore.id === store.id) >= 0) >= 0)
            .filter((_store, index) => index >= skip && index < (take ? skip + take : voucherCodes.length));
    }

    public async create(data: {
        name: string, startAt: Date, endAt: Date, value: number, storeIds: number[]
        description?: string, image?: string, minBillPrice?: number, maxPriceDiscount?: number,
        isActive?: boolean, isPercent?: boolean
    }) {
        // Generate unique code
        let code = '';
        do {
            code = RandomCode.generate();
        } while (await VoucherCode.findOne(code));

        const stores = [];
        for (const storeId of data.storeIds) {
            stores.push(await StoreService.getOne(storeId));
        }

        const newVoucherCode = new VoucherCode();
        newVoucherCode.code = code;
        newVoucherCode.name = data.name;
        newVoucherCode.value = data.value;
        newVoucherCode.startAt = data.startAt;
        newVoucherCode.endAt = data.endAt;
        newVoucherCode.description = data.description;
        newVoucherCode.image = data.image;
        newVoucherCode.minBillPrice = data.minBillPrice;
        newVoucherCode.maxPriceDiscount = data.maxPriceDiscount;
        newVoucherCode.isActive = data.isActive;
        newVoucherCode.isPercent = data.isPercent;
        newVoucherCode.stores = stores;

        const voucherCode = await newVoucherCode.save();
        if (!voucherCode) { throw new Error(__('voucher_code.create_fail')); }

        return await this.getOne(voucherCode.code);
    }

    public async edit(code: string, data: {
        name?: string, startAt?: Date, endAt?: Date, value?: number, storeIds?: number[]
        description?: string, image?: string, minBillPrice?: number, maxPriceDiscount?: number,
        isActive?: boolean, isPercent?: boolean
    }) {
        const voucherCode = await this.getOne(code);

        if (data.name) { voucherCode.name = data.name; }
        if (data.startAt) { voucherCode.startAt = data.startAt; }
        if (data.endAt) { voucherCode.endAt = data.endAt; }
        if (data.value) { voucherCode.value = data.value; }
        if (data.storeIds) {
            const stores = [];
            for (const storeId of data.storeIds) {
                stores.push(await StoreService.getOne(storeId));
            }
            voucherCode.stores = stores;
        }
        if (data.description) { voucherCode.description = data.description; }
        if (data.image) { voucherCode.image = data.image; }
        if (data.minBillPrice) { voucherCode.minBillPrice = data.minBillPrice; }
        if (data.maxPriceDiscount) { voucherCode.maxPriceDiscount = data.maxPriceDiscount; }
        if (data.isActive) { voucherCode.isActive = data.isActive; }
        if (data.isPercent) { voucherCode.isPercent = data.isPercent; }

        return await this.getOne((await voucherCode.save()).code);
    }

    public async delete(code: string) {
        const voucherCode = await this.getOne(code);

        if (!voucherCode) {
            throw new Error(__('voucher_code.voucher_code_not_found'));
        }

        await voucherCode.remove();
    }

    public async getOne(code: string, options: {
        withStores: boolean
    } = { withStores: true }) {
        const voucherCode = await VoucherCode.findOne(code, options.withStores ? { relations: ['stores'] } : {});

        if (!voucherCode) {
            throw new Error(__('voucher_code.voucher_code_not_found'));
        }

        return voucherCode;
    }

    /**
     * @param storeId If you have check code enable for this store. 
     * @throws Error If it has
     */
    public async isValid(code: string, other?: { storeId?: number, billPrice?: number, time?: Date }) {
        const voucherCode = await this.getOne(code);

        if (!voucherCode.isActive) {
            throw new Error(__('discount_code.no_longer_valid'));
        }

        const time = other?.time || new Date();
        if (time > voucherCode.endAt) {
            throw new Error(__('discount_code.expire'));
        }
        if (time < voucherCode.startAt) {
            throw new Error(__('discount_code.not_started_yet'));
        }

        if (other?.storeId && voucherCode.stores.findIndex(item => item.id === other.storeId) < 0) {
            throw new Error(__('discount_code.not_apply_for_this_store'));
        }

        if (other?.billPrice && other.billPrice < voucherCode.minBillPrice) {
            throw new Error(__('discount_code.not_apply_for_this_price'));
        }
    }
}

const voucherCodeService = new VoucherCodeService();

export { voucherCodeService as VoucherCodeService };
