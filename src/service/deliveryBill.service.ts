import { __ } from 'i18n';
import { DaySession } from '../entity/dailyDish';
import { DeliveryBill } from '../entity/deliveryBill';
import { User } from '../entity/user';
import { HttpError, HttpErrorCode } from '../lib/httpError';
import { AddressService } from './address.service';
import { CustomerService } from './customer.service';
import { DailyDishService } from './dailyDish.service';
import { DeliveryBillDishService } from './deliveryBillDish.service';
import { DiscountCodeService } from './discountCode.service';
import { UserService } from './user.service';
import { VoucherCodeService } from './voucherCode.service';

class DeliveryBillService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const deliveryBill = await DeliveryBill.find({ take, skip, order, where: { deleteAt: null } });

        return deliveryBill;
    }

    public async create(data: {
        dishIds: number[], customerUuid: string, addressId: number,
        dishNotes?: string[], dishQuantities?: number[], shipAt?: Date, shipByUuid?: string,
        createAt?: Date, prepareAt?: Date, prepareByUuid?: string, preparedAt?: Date, collectAt?: Date,
        collectValue?: number, rating?: number, note?: string, voucherCode?: string, discountCode?: string
    }) {
        const newDeliveryBill = new DeliveryBill();
        newDeliveryBill.createAt = data.createAt || new Date();
        newDeliveryBill.rating = data.rating;
        newDeliveryBill.note = data.note;

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
            await DailyDishService.getOne(time, dishId, DaySession.None);
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
            withDishes: !!data.dishIds
        });
    }

    public async createWithRestrict(data: {
        dishIds: number[], customerUuid: string, addressId: number,
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

    public async edit(id: number, data: {
        prepareAt?: Date, prepareByUuid?: string, shipAt?: Date, shipByUuid?: string, collectAt?: Date,
        collectValue?: number, addressId?: number, dishIds?: number[], dishNotes?: string[], dishQuantities?: number[],
        rating?: number, note?: string, voucherCode?: string, discountCode?: string,
    }) {
        const deliveryBill = await this.getOne(id,
            {
                withCustomer: true,
                withPrepareBy: true,
                withShipBy: true
            });

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

        if (data.collectAt) {
            deliveryBill.collectAt = data.collectAt;
        }
        if (data.collectValue) {
            deliveryBill.collectValue = data.collectValue;
        }
        if (data.shipAt) {
            deliveryBill.shipAt = data.shipAt;
        }
        if (data.shipByUuid) {
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
        for (const dishId of data.dishIds) {
            await DailyDishService.getOne(deliveryBill.createAt, dishId, DaySession.None);
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

        await deliveryBill.save();

        return await this.getOne(deliveryBill.id, {
            withCustomer: true,
            withPrepareBy: true,
            withShipBy: true,
            withDishes: true
        });
    }

    /**
     * Select deliveryBill to prepare for chef 
     */
    public async prepareDeliveryBill(id: number, data: { prepareByUuid: string }) {
        const deliveryBill = await this.getOne(id, { withPrepareBy: true });
        try {
            deliveryBill.prepareBy = await UserService.getOne({ uuid: data.prepareByUuid });
            deliveryBill.prepareAt = new Date();
        } catch (_e) { throw new Error(__('delivery_bill.prepared_user_not_found')); }

        await deliveryBill.save();

        return await this.getOne(id, { withPrepareBy: true });
    }

    /**
     * 
     * @param id DeliveryBill Id.
     * @param updateByUuid Uuid of user who select this bill to confirm prepared.
     */
    public async preparedDeliveryBill(id: number, updateByUuid: string) {
        const deliveryBill = await this.getOne(id, { withPrepareBy: true });
        if (deliveryBill.prepareBy.uuid !== updateByUuid) {
            throw new HttpError(HttpErrorCode.UNAUTHORIZED, 'delivery_bill.can_not_edit_bill_of_other_chef');
        }
        deliveryBill.preparedAt = new Date();
        await deliveryBill.save();
    }

    /**
     * 
     * @param id Delivery bill id.
     * @param shipByUuid  Uuid of user who will ship this bill.
     */
    public async shipDeliveryBill(id: number, shipByUuid: string) {
        const deliveryBill = await this.getOne(id, { withShipBy: true });
        try {
            deliveryBill.shipBy = await UserService.getOne({ uuid: shipByUuid });
            deliveryBill.shipAt = new Date();
        } catch (_e) { throw new Error(__('delivery_bill.user_not_found')); }

        await deliveryBill.save();
    }

    /**
     * Collect money of delivery bill for staff
     */
    public async collectDeliveryBill(id: number, data: { collectByUuid: string, collectValue: number, note: string }) {

        const deliveryBill = await this.getOne(id, { withShipBy: true });

        if (data.collectByUuid) {

            if (deliveryBill.shipBy.uuid !== data.collectByUuid) {
                throw new HttpError(HttpErrorCode.UNAUTHORIZED, 'delivery_bill.can_not_edit_bill_of_other_shipper');
            }

            if (data.collectValue === null || data.collectValue === undefined) {
                throw new Error(__('delivery_bill.collect_value_must_be_not_null'));
            }

            try {
                deliveryBill.collectAt = new Date();
                deliveryBill.collectValue = data.collectValue;
                deliveryBill.note = data.note;
            } catch (_e) { throw new Error(__('delivery_bill.user_not_found')); }
        }

        await deliveryBill.save();
    }

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
            withShipBy?: boolean, withPrepareBy?: boolean, withCustomer?: boolean, withDishes?: boolean
        }) {

        const relations = [];
        if (options?.withCustomer) { relations.push('customer'); }
        if (options?.withPrepareBy) { relations.push('prepareBy'); }
        if (options?.withShipBy) { relations.push('shipBy'); }
        if (options?.withDishes) { relations.push('dishes'); }

        const deliveryBill = await DeliveryBill.findOne(id, { relations, where: { deleteAt: null } });

        if (!deliveryBill || deliveryBill.deleteAt) {
            throw new Error(__('delivery_bill.delivery_bill_not_found'));
        }

        return deliveryBill;
    }
}

const deliveryBillService = new DeliveryBillService();

export { deliveryBillService as DeliveryBillService };
