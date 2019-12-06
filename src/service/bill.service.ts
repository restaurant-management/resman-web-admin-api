import { __ } from 'i18n';
import { Bill } from '../entity/bill';
import { User } from '../entity/user';
import { AuthorizationStore } from '../middleware/authorization';
import { BillDishService } from './billDish.service';
import { BillHistoryService } from './billHistory.service';
import { CustomerService } from './customer.service';
import { DiscountCodeService } from './discountCode.service';
import { StoreService } from './store.service';
import { UserService } from './user.service';
import { VoucherCodeService } from './voucherCode.service';

class BillService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const bill = await Bill.find({ take, skip, order, where: { deleteAt: null } });

        return bill;
    }

    public async create(data: {
        tableNumber: number, dishIds: number[], createByUuid: string, storeId: number,
        dishNotes?: string[], dishQuantities?: number[],
        createAt?: Date, prepareAt?: Date, prepareByUuid?: string, collectAt?: Date,
        collectByUuid?: string, collectValue?: number, rating?: number, note?: string
        voucherCode?: string, discountCode?: string, customerUuid?: string
    }) {
        if (!data.tableNumber || !data.dishIds || !data.createByUuid || !data.storeId) {
            throw new Error(__('error.missing_required_information'));
        }

        let createBy: User;
        try {
            createBy = await UserService.getOne({ uuid: data.createByUuid },
                { withRoles: true, withStores: true, withWarehouses: true });
        } catch (_e) { throw new Error(__('bill.created_user_not_found')); }

        AuthorizationStore(createBy, data.storeId);

        const newBill = new Bill();
        newBill.tableNumber = data.tableNumber;
        newBill.createAt = data.createAt || new Date();
        newBill.rating = data.rating;
        newBill.note = data.note;

        newBill.store = await StoreService.getOne(data.storeId);

        newBill.createBy = createBy;

        if (data.voucherCode) {
            const voucher = await VoucherCodeService.getOne(data.voucherCode);
            newBill.voucherCode = data.voucherCode;
            newBill.voucherValue = voucher.value;
            newBill.voucherIsPercent = voucher.isPercent;
        }

        if (data.discountCode) {
            const discount = await DiscountCodeService.getOne(data.discountCode);
            newBill.discountCode = data.discountCode;
            newBill.discountValue = discount.discount;
        }

        if (data.customerUuid) {
            newBill.customer = await CustomerService.getOne({ uuid: data.customerUuid });
        }

        if (data.prepareByUuid) {
            try {
                newBill.prepareBy = await UserService.getOne({ uuid: data.prepareByUuid });
                newBill.prepareAt = data.prepareAt || new Date();
            } catch (_e) { throw new Error(__('bill.prepared_user_not_found')); }
        }

        if (data.collectByUuid) {
            if (data.collectValue) {
                throw new Error(__('bill.collect_value_must_be_not_null'));
            }
            try {
                newBill.collectBy = await UserService.getOne({ uuid: data.collectByUuid });
                newBill.collectAt = data.collectAt || new Date();
                newBill.collectValue = data.collectValue;
            } catch (_e) { throw new Error(__('bill.collected_user_not_found')); }
        }

        const bill = await newBill.save({ reload: true });
        if (!bill) { throw new Error(__('bill.create_fail')); }

        try {
            await BillHistoryService.create(bill.id, {
                dishIds: data.dishIds,
                dishNotes: data.dishNotes,
                dishQuantities: data.dishQuantities,
                userUuid: data.createByUuid,
                description: data.note,
                createAt: data.createAt
            });
        } catch (e) {
            await bill.remove();
            console.error(e);
            throw new Error(__('bill.create_bill_fail'));
        }

        return await this.getOne(bill.id, {
            withCollectBy: !!data.collectByUuid,
            withCreateBy: true,
            withCustomer: !!data.customerUuid,
            withPrepareBy: !!data.prepareByUuid,
            withStore: true,
            showDishesType: 'dishes'
        });
    }

    public async createWithRestrict(data: {
        tableNumber: number, dishIds: number[], createByUuid: string, storeId: number,
        dishQuantities?: number[], note?: string, voucherCode?: string, discountCode?: string, customerUuid?: string
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
        updateByUuid: string, updateAt?: Date,
        tableNumber?: number, dishIds?: number[], dishNotes?: string[], dishQuantities?: number[],
        prepareAt?: Date, prepareByUuid?: string, collectAt?: Date, collectByUuid?: string, collectValue?: number,
        rating?: number, note?: string, voucherCode?: string, discountCode?: string, customerUuid?: string
    }) {
        const bill = await this.getOne(id,
            {
                withCollectBy: true, withCreateBy: true, withCustomer: true,
                withPrepareBy: true, showDishesType: 'dishes', withStore: true
            }
        );

        AuthorizationStore(await UserService.getOne({ uuid: data.updateByUuid }, { withStores: true }), bill.store.id);

        // Save data
        if (data.tableNumber) {
            bill.tableNumber = data.tableNumber;
        }
        // Create new history if dishIds existed.
        if (data.dishIds) {
            await BillHistoryService.create(bill.id, {
                createAt: data.updateAt || new Date(),
                dishIds: data.dishIds,
                dishNotes: data.dishNotes,
                dishQuantities: data.dishQuantities,
                userUuid: data.updateByUuid,
                description: data.note
            });
        }

        if (data.prepareAt) {
            bill.prepareAt = data.prepareAt;
        }
        if (data.prepareByUuid) {
            try {
                bill.prepareBy = await UserService.getOne({ uuid: data.prepareByUuid });
            } catch (_e) { throw new Error(__('bill.prepared_user_not_found')); }
        }
        if (data.prepareByUuid === '') {
            bill.prepareBy = null;
            bill.prepareAt = null;
        }

        if (data.collectAt) {
            bill.collectAt = data.collectAt;
        }
        if (data.collectValue) {
            bill.collectValue = data.collectValue;
        }
        if (data.collectByUuid) {
            try {
                bill.collectBy = await UserService.getOne({ uuid: data.collectByUuid });
            } catch (_e) { throw new Error(__('bill.collected_user_not_found')); }
        }
        if (data.collectByUuid === '') { // Remove time :v
            bill.collectBy = null;
            bill.collectAt = null;
            bill.collectValue = null;
        }

        if (data.rating) {
            bill.rating = data.rating;
        }

        if (data.note) {
            bill.note = data.note;
        }

        if (data.voucherCode) {
            const voucher = await VoucherCodeService.getOne(data.voucherCode);
            bill.voucherCode = data.voucherCode;
            bill.voucherValue = voucher.value;
            bill.voucherIsPercent = voucher.isPercent;
        }
        if (data.voucherCode === '') { // Remove time :v
            bill.voucherCode = null;
            bill.voucherValue = null;
            bill.voucherIsPercent = null;
        }

        if (data.discountCode) {
            const discount = await DiscountCodeService.getOne(data.discountCode);
            bill.discountCode = data.discountCode;
            bill.discountValue = discount.discount;
        }
        if (data.discountCode === '') {
            bill.discountCode = null;
            bill.discountValue = null;
        }

        if (data.customerUuid) {
            bill.customer = await CustomerService.getOne({ uuid: data.customerUuid });
        }
        if (data.customerUuid === '') {
            bill.customer = null;
        }

        await bill.save();

        return await this.getOne(bill.id, {
            withCollectBy: !!data.collectByUuid || data.collectByUuid === '',
            withCreateBy: true,
            withCustomer: !!data.customerUuid || data.customerUuid === '',
            withPrepareBy: !!data.prepareByUuid || data.prepareByUuid === '',
            showDishesType: 'dishes',
            withStore: true
        });
    }

    // Use by staff
    public async changeDishes(id: number, data: {
        updateByUuid: string, dishIds: number[], dishNotes?: string[], dishQuantities?: number[], note?: string
    }) {
        const bill = await this.getOne(id, { withCollectBy: true });

        if (bill.collectBy) {
            throw new Error(__('bill.bill_is_collected'));
        }

        return await this.edit(id, data);
    }

    /**
     * Select bill to prepare for chef 
     */
    public async prepareBill(id: number, data: { prepareByUuid: string }) {
        return this.edit(id, { updateByUuid: data.prepareByUuid, prepareByUuid: data.prepareByUuid });
    }

    /**
     * 
     * @param id Bill Id.
     * @param dishId Prepared all if dish id is null.
     */
    public async preparedBillDish(id: number, dishId?: number) {
        const bill = await this.getOne(id, { showDishesType: 'histories' });
        const histories = bill.histories;
        if (bill.histories.length === 0) {
            throw new Error(__('bill.bill_does_not_have_history'));
        }

        if (dishId) {
            await BillDishService.prepared(dishId, histories[histories.length - 1].id);
        } else {
            const dishes = (await BillHistoryService.getOne(
                id, histories[histories.length - 1].id, { withDishes: true })).dishes;
            for (const dish of dishes) {
                await BillDishService.prepared(dish.dishId, dish.billHistoryId);
            }
        }
    }

    public async deliveredBillDish(id: number, dishId?: number) {
        const bill = await this.getOne(id, { showDishesType: 'histories' });
        const histories = bill.histories;
        if (bill.histories.length === 0) {
            throw new Error(__('bill.bill_does_not_have_history'));
        }

        if (dishId) {
            await BillDishService.delivered(dishId, histories[histories.length - 1].id);
        } else {
            const dishes = (await BillHistoryService.getOne(
                id, histories[histories.length - 1].id, { withDishes: true })).dishes;
            for (const dish of dishes) {
                await BillDishService.delivered(dish.dishId, dish.billHistoryId);
            }
        }
    }

    /**
     * Collect money of bill for staff
     */
    public async collectBill(id: number, data: { collectByUuid: string, collectValue: number, note: string }) {
        const bill = await this.getOne(id, { withCollectBy: true });

        if (data.collectByUuid) {
            if (!data.collectValue) {
                throw new Error(__('bill.collect_value_must_be_not_null'));
            }
            try {
                bill.collectBy = await UserService.getOne({ uuid: data.collectByUuid });
                bill.collectAt = new Date();
                bill.collectValue = data.collectValue;
                bill.note = data.note;
            } catch (_e) { throw new Error(__('bill.collected_user_not_found')); }
        }

        await bill.save();

        return await this.getOne(id, { withCollectBy: true });
    }

    public async assignCustomer(id: number, data: { customerUuid: string }) {
        const bill = await this.getOne(id);

        if (bill.customer) {
            throw new Error(__('bill.bill_have_been_already_assigned'));
        }

        bill.customer = await CustomerService.getOne({ uuid: data.customerUuid });

        await bill.save();
    }

    public async rateBill(id: number, data: { rating: number }) {
        const bill = await this.getOne(id);

        if (!bill.customer) {
            throw new Error(__('bill.need_assign_customer_before_rating'));
        }

        bill.rating = data.rating;

        return await bill.save();
    }

    public async delete(id: number, user: User) {
        const bill = await this.getOne(id);
        await bill.softDelete(user);
    }

    public async getOne(id: number,
        options?: {
            withCreateBy?: boolean, withPrepareBy?: boolean, withCollectBy?: boolean,
            withStore?: boolean, withCustomer?: boolean, showDishesType?: 'dishes' | 'histories'
        }
    ) {

        const relations = [];
        relations.push('histories');
        if (options?.withCollectBy) { relations.push('collectBy'); }
        if (options?.withCreateBy) { relations.push('createBy'); }
        if (options?.withCustomer) { relations.push('customer'); }
        if (options?.withPrepareBy) { relations.push('prepareBy'); }
        if (options?.withStore) { relations.push('store'); }

        const bill = await Bill.findOne(id, { relations, where: { deleteAt: null } });

        if (!bill || bill.deleteAt) {
            throw new Error(__('bill.bill_not_found'));
        }

        if (options?.showDishesType === 'dishes') {
            if (bill.histories.length > 0) {
                let newestTime = bill.histories[0].createAt;
                let historyId = bill.histories[0].id;
                for (let i = 1; i < bill.histories.length; i++) {
                    if (newestTime < bill.histories[i].createAt) {
                        newestTime = bill.histories[i].createAt;
                        historyId = bill.histories[i].id;
                    }
                }

                const history = await BillHistoryService.getOne(id, historyId, { withDishes: true, withUser: true });
                bill['updateAt'] = newestTime;
                bill['updateBy'] = history.user;
                bill['dishes'] = history.dishes;
                delete bill.histories;
            } else {
                bill['updateAt'] = null;
                bill['updateBy'] = null;
                bill['dishes'] = [];
                delete bill.histories;
            }
        }

        return bill;
    }
}

const billService = new BillService();

export { billService as BillService };
