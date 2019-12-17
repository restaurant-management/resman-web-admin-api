import { __ } from 'i18n';
import { FindConditions } from 'typeorm';
import { DaySession } from '../entity/dailyDish';
import { DeliveryBill } from '../entity/deliveryBill';
import { User } from '../entity/user';
import { HttpError, HttpErrorCode } from '../lib/httpError';
import { AuthorizationStore } from '../middleware/authorization';
import { AddressService } from './address.service';
import { CustomerService } from './customer.service';
import { DailyDishService } from './dailyDish.service';
import { DeliveryBillDishService } from './deliveryBillDish.service';
import { DiscountCodeService } from './discountCode.service';
import { StoreService } from './store.service';
import { UserService } from './user.service';
import { VoucherCodeService } from './voucherCode.service';

class DeliveryBillService {
    public async getAll(options: {
        length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1' // Paging
        where?: FindConditions<DeliveryBill>;
    }) {
        const order = options.orderId ?
            { [options.orderId]: options.orderType === 'DESC' || options.orderType === '-1' ? -1 : 1 } : {};
        const skip = (options.page - 1) * length >= 0 ? (options.page - 1) * length : 0;
        const take = length;

        const deliveryBill = await DeliveryBill.find({
            take, skip, order,
            where: { ...options.where, deleteAt: null }
        });

        return deliveryBill;
    }

    public async create(data: {
        storeId: number, dishIds: number[], customerUuid: string, addressId: number,
        dishNotes?: string[], dishQuantities?: number[], shipAt?: Date, shipByUuid?: string,
        createAt?: Date, prepareAt?: Date, prepareByUuid?: string, preparedAt?: Date, collectAt?: Date,
        collectValue?: number, rating?: number, note?: string, voucherCode?: string, discountCode?: string
    }) {
        if (!data.storeId || !data.dishIds || !data.customerUuid || !data.addressId) {
            throw new Error(__('error.missing_required_information'));
        }

        const newDeliveryBill = new DeliveryBill();
        newDeliveryBill.createAt = data.createAt || new Date();
        newDeliveryBill.rating = data.rating;
        newDeliveryBill.note = data.note;

        newDeliveryBill.store = await StoreService.getOne(data.storeId);

        // Created user must be not null by controller.
        try {
            newDeliveryBill.customer = await CustomerService.getOne({ uuid: data.customerUuid });
            // Add address
            const address = await AddressService.getOne(newDeliveryBill.customer.username, data.addressId);
            newDeliveryBill.address = address.address;
            newDeliveryBill.longitude = address.longitude;
            newDeliveryBill.latitude = address.latitude;
        } catch (_e) { throw new Error(__('delivery_bill.customer_not_found')); }

        if (data.voucherCode) {
            const voucher = await VoucherCodeService.getOne(data.voucherCode);
            newDeliveryBill.voucherCode = data.voucherCode;
            newDeliveryBill.voucherValue = voucher.value;
            newDeliveryBill.voucherIsPercent = voucher.isPercent;
        }

        if (data.discountCode) {
            const discount = await DiscountCodeService.getOne(data.discountCode);
            newDeliveryBill.discountCode = data.discountCode;
            newDeliveryBill.discountValue = discount.discount;
        }

        if (data.customerUuid) {
            newDeliveryBill.customer = await CustomerService.getOne({ uuid: data.customerUuid });
        }

        if (data.prepareByUuid) {
            try {
                newDeliveryBill.prepareBy = await UserService.getOne({ uuid: data.prepareByUuid });
                newDeliveryBill.prepareAt = data.prepareAt || new Date();
                newDeliveryBill.preparedAt = data.preparedAt || new Date();
            } catch (_e) { throw new Error(__('delivery_bill.prepared_user_not_found')); }
        }

        if (data.shipByUuid) {
            try {
                newDeliveryBill.shipBy = await UserService.getOne({ uuid: data.shipByUuid });
                newDeliveryBill.shipAt = data.shipAt ?? new Date();
                newDeliveryBill.collectAt = data.collectAt ?? new Date();
                newDeliveryBill.collectValue = data.collectValue;
            } catch (e) {
                throw new Error(__('delivery_bill.ship_user_not_found'));
            }
        }

        const deliveryBill = await newDeliveryBill.save({ reload: true });
        if (!deliveryBill) { throw new Error(__('delivery_bill.create_fail')); }

        const time = data.createAt || new Date();

        // Check whether dish is daily dish.
        for (const dishId of data.dishIds) {
            await DailyDishService.getOne({ day: time, dishId, session: DaySession.None, storeId: data.storeId });
        }

        for (const [index, dishId] of data.dishIds.entries()) {
            const dishNotes = data.dishNotes || [];
            const dishQuantities = data.dishQuantities || [];

            await DeliveryBillDishService.create(deliveryBill.id,
                {
                    dishId,
                    note: dishNotes[index],
                    quantity: dishQuantities[index]
                });
        }

        return await this.getOne(deliveryBill.id, {
            withCustomer: !!data.customerUuid,
            withPrepareBy: !!data.prepareByUuid,
            withShipBy: !!data.shipByUuid,
            withDishes: !!data.dishIds,
            withStore: true
        });
    }

    public async createWithRestrict(data: {
        storeId: number, dishIds: number[], customerUuid: string, addressId: number,
        dishNotes?: string[], dishQuantities?: number[], note?: string, voucherCode?: string, discountCode?: string
    }) {
        if (data.voucherCode) {
            await VoucherCodeService.isValid(data.voucherCode);
        }
        if (data.discountCode) {
            await DiscountCodeService.isValid(data.discountCode);
        }

        return await this.create(data);
    }

    public async edit(id: number, editBy: User, data: {
        prepareAt?: Date, preparedAt?: Date, prepareByUuid?: string, shipAt?: Date, shipByUuid?: string,
        collectAt?: Date, collectValue?: number, addressId?: number, dishIds?: number[], dishNotes?: string[],
        dishQuantities?: number[], rating?: number, note?: string, voucherCode?: string, discountCode?: string,
    }) {
        const deliveryBill = await this.getOne(id,
            {
                withCustomer: true,
                withPrepareBy: true,
                withShipBy: true,
                withStore: true
            }
        );

        // Check if user have right to edit bill of other store
        AuthorizationStore(editBy, deliveryBill.store.id);

        if (data.prepareAt) {
            deliveryBill.prepareAt = data.prepareAt;
        }
        if (data.prepareByUuid) {
            try {
                deliveryBill.prepareBy = await UserService.getOne({ uuid: data.prepareByUuid });
            } catch (_e) { throw new Error(__('delivery_bill.prepared_user_not_found')); }
        }
        if (data.prepareByUuid === '') {
            deliveryBill.prepareBy = null;
            deliveryBill.prepareAt = null;
        }

        if (data.preparedAt) {
            if (!deliveryBill.prepareBy) {
                throw new Error(__('delivery_bill.could_not_mark_prepared_for_bill_with_no_chef_select'));
            }
            deliveryBill.preparedAt = data.preparedAt;
        }

        if (data.collectAt) {
            deliveryBill.collectAt = data.collectAt;
        }
        if (data.collectValue !== null && data.collectValue !== undefined) {
            deliveryBill.collectValue = data.collectValue;
        }
        if (data.shipAt) {
            deliveryBill.shipAt = data.shipAt;
        }
        if (data.shipByUuid) {
            if (!deliveryBill.preparedAt) {
                throw new Error(__('delivery_bill.could_not_ship_bill_did_not_prepare_yet'));
            }
            try {
                deliveryBill.shipBy = await UserService.getOne({ uuid: data.shipByUuid });
            } catch (_e) { throw new Error(__('delivery_bill.ship_user_not_found')); }
        }
        if (data.shipByUuid === '') { // Remove time :v
            deliveryBill.shipBy = null;
            deliveryBill.shipAt = null;
            deliveryBill.collectAt = null;
            deliveryBill.collectValue = null;
        }

        if (data.rating) {
            deliveryBill.rating = data.rating;
        }

        if (data.note) {
            deliveryBill.note = data.note;
        }

        if (data.voucherCode) {
            const voucher = await VoucherCodeService.getOne(data.voucherCode);
            deliveryBill.voucherCode = data.voucherCode;
            deliveryBill.voucherValue = voucher.value;
            deliveryBill.voucherIsPercent = voucher.isPercent;
        }
        if (data.voucherCode === '') { // Remove time :v
            deliveryBill.voucherCode = null;
            deliveryBill.voucherValue = null;
            deliveryBill.voucherIsPercent = null;
        }

        if (data.discountCode) {
            const discount = await DiscountCodeService.getOne(data.discountCode);
            deliveryBill.discountCode = data.discountCode;
            deliveryBill.discountValue = discount.discount;
        }
        if (data.discountCode === '') {
            deliveryBill.discountCode = null;
            deliveryBill.discountValue = null;
        }

        // Check whether dish is daily dish.
        if (data.dishIds) {
            for (const dishId of data.dishIds) {
                await DailyDishService.getOne({
                    day: deliveryBill.createAt, dishId, session: DaySession.None, storeId: deliveryBill.store.id
                });
            }
            for (const [index, dishId] of data.dishIds.entries()) {
                const dishNotes = data.dishNotes || [];
                const dishQuantities = data.dishQuantities || [];

                try {
                    await DeliveryBillDishService.getOne(dishId, deliveryBill.id);
                    await DeliveryBillDishService.edit(dishId, deliveryBill.id,
                        {
                            note: dishNotes[index],
                            quantity: dishQuantities[index]
                        });
                } catch (e) {
                    await DeliveryBillDishService.create(deliveryBill.id,
                        {
                            dishId,
                            note: dishNotes[index],
                            quantity: dishQuantities[index]
                        });
                }
            }
        }

        await deliveryBill.save();

        return await this.getOne(deliveryBill.id, {
            withCustomer: true,
            withPrepareBy: true,
            withShipBy: true,
            withDishes: true,
            withStore: true
        });
    }

    /**
     * Select deliveryBill to prepare for chef 
     */
    public async prepareDeliveryBill(id: number, editBy: User) {
        return await this.edit(id, editBy, { prepareAt: new Date(), prepareByUuid: editBy.uuid });
    }

    /**
     * 
     * @param id DeliveryBill Id.
     * @param editBy User who select this bill to confirm prepared.
     */
    public async preparedDeliveryBill(id: number, editBy: User) {
        return await this.edit(id, editBy, { preparedAt: new Date() });
    }

    /**
     * 
     * @param id Delivery bill id.
     * @param shipByUuid  Uuid of user who will ship this bill.
     */
    public async shipDeliveryBill(id: number, editBy: User) {
        return await this.edit(id, editBy, { shipAt: new Date(), shipByUuid: editBy.uuid });
    }

    /**
     * Collect money of delivery bill for staff
     */
    public async collectDeliveryBill(id: number, editBy: User, data: { collectValue: number, note: string }) {

        const deliveryBill = await this.getOne(id, { withShipBy: true });

        if (deliveryBill.shipBy.uuid !== editBy.uuid) {
            throw new HttpError(HttpErrorCode.UNAUTHORIZED, 'delivery_bill.can_not_edit_bill_of_other_shipper');
        }

        if (data.collectValue === null || data.collectValue === undefined) {
            throw new Error(__('delivery_bill.collect_value_must_be_not_null'));
        }

        return this.edit(id, editBy, { collectAt: new Date(), collectValue: data.collectValue, note: data.note });
    }

    // Function for customer so don't need to check store.
    public async rateDeliveryBill(id: number, data: { customerUuid: string, rating: number }) {
        const deliveryBill = await this.getOne(id, { withCustomer: true });

        if (deliveryBill.customer.uuid !== data.customerUuid) {
            throw new HttpError(HttpErrorCode.UNAUTHORIZED, __('authentication.unauthorized'));
        }

        if (!deliveryBill.collectAt) {
            throw new Error(__('delivery_bill.can_not_rate_if_bill_not_done'));
        }

        if (deliveryBill.rating) {
            throw new Error(__('delivery_bill.bill_have_been_already_rated'));
        }

        deliveryBill.rating = data.rating;

        return await deliveryBill.save();
    }

    public async delete(id: number, user: User) {
        const deliveryBill = await this.getOne(id);
        await deliveryBill.softDelete(user);
    }

    public async getOne(id: number,
        options?: {
            withShipBy?: boolean, withPrepareBy?: boolean, withCustomer?: boolean,
            withDishes?: boolean, withStore?: boolean
        }) {

        const relations = [];
        if (options?.withCustomer) { relations.push('customer'); }
        if (options?.withPrepareBy) { relations.push('prepareBy'); }
        if (options?.withShipBy) { relations.push('shipBy'); }
        if (options?.withDishes) { relations.push('dishes'); }
        if (options?.withStore) { relations.push('store'); }

        const deliveryBill = await DeliveryBill.findOne(id, { relations, where: { deleteAt: null } });

        if (!deliveryBill || deliveryBill.deleteAt) {
            throw new Error(__('delivery_bill.delivery_bill_not_found'));
        }

        return deliveryBill;
    }
}

const deliveryBillService = new DeliveryBillService();

export { deliveryBillService as DeliveryBillService };
