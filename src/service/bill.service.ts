import { __ } from 'i18n';
import { FindConditions } from 'typeorm';
import { Bill } from '../entity/bill';
import { User } from '../entity/user';
import { arrayCompare } from '../helper/arrayCompare';
import { AuthorizationStore } from '../middleware/authorization';
import { socketServer } from '../socket';
import { ChefBillSocketEvent } from '../socket/chefBill.socket';
import { ChefBillDetailSocketEvent } from '../socket/chefBillDetail.socket';
import { SocketRoute } from '../socket/socket.route';
import { StaffBillSocketEvent } from '../socket/staffBill.socket';
import { BillDishService } from './billDish.service';
import { BillHistoryService } from './billHistory.service';
import { CustomerService } from './customer.service';
import { DiscountCodeService } from './discountCode.service';
import { StoreService } from './store.service';
import { UserService } from './user.service';
import { VoucherCodeService } from './voucherCode.service';

class BillService {
    public async getAll(user: User, options?: {
        length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1'
        where?: FindConditions<Bill>
    }) {
        const order = options?.orderId ? {
            [options?.orderId]: options?.orderType === 'DESC' || options?.orderType === '-1' ? -1 : 1
        } : {};
        const skip = (options?.page - 1) * options?.length >= 0 ? (options?.page - 1) * options?.length : 0;
        const take = options?.length;

        const bills = await Bill.find({
            take, skip, order, where: { ...options?.where, deleteAt: null },
            relations: ['histories', 'collectBy', 'createBy', 'customer', 'prepareBy', 'store']
        });

        const filterBills = bills.filter(i => user.stores.findIndex(userStore => userStore.id === i.store.id) >= 0)
            .filter((_store, index) => index >= skip && index < (take ? skip + take : bills.length));

        for (const bill of filterBills) {
            if (bill.histories.length > 0) {
                let newestTime = bill.histories[0].createAt;
                let historyId = bill.histories[0].id;
                for (let i = 1; i < bill.histories.length; i++) {
                    if (newestTime < bill.histories[i].createAt) {
                        newestTime = bill.histories[i].createAt;
                        historyId = bill.histories[i].id;
                    }
                }

                const history = await BillHistoryService.getOne(bill.id, historyId,
                    { withDishes: true, withUser: true }
                );
                bill['updateAt'] = newestTime;
                bill['updateBy'] = history.user;
                bill['dishes'] = history.dishes;
            } else {
                bill['updateAt'] = null;
                bill['updateBy'] = null;
                bill['dishes'] = [];
            }
        }

        return filterBills;
    }

    public async getAllByUser(user: User, length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const bills = await Bill.find({
            take, skip, order, where: { deleteAt: null },
            relations: ['histories', 'collectBy', 'createBy', 'customer', 'prepareBy', 'store']
        });

        return bills
            .filter(i => i.collectBy?.uuid === user.uuid
                || i.createBy?.uuid === user.uuid
                || i.prepareBy?.uuid === user.uuid
            )
            .filter((_bill, index) => index >= skip && index < (take ? skip + take : bills.length));
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
        } catch (_e) {
            throw new Error(__('bill.created_user_not_found'));
        }
        if (createBy.roles.findIndex(i => i.slug === 'staff') === -1) {
            throw new Error(__('bill.created_by_must_be_staff'));
        }

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
            } catch (_e) {
                throw new Error(__('bill.prepared_user_not_found'));
            }
        }

        if (data.collectByUuid) {
            if (!data.collectValue) {
                throw new Error(__('bill.collect_value_must_be_not_null'));
            }
            try {
                newBill.collectBy = await UserService.getOne({ uuid: data.collectByUuid });
                newBill.collectAt = data.collectAt || new Date();
                newBill.collectValue = data.collectValue;
            } catch (_e) {
                throw new Error(__('bill.collected_user_not_found'));
            }
        }

        const bill = await newBill.save({ reload: true });
        if (!bill) {
            throw new Error(__('bill.create_fail'));
        }

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

        const b = await this.getOne(bill.id, {
            withCollectBy: !!data.collectByUuid,
            withCreateBy: true,
            withCustomer: !!data.customerUuid,
            withPrepareBy: !!data.prepareByUuid,
            withStore: true,
            showDishesType: 'dishes'
        });

        // Notify to all chef about new bill
        socketServer.of(SocketRoute.chefBill).emit(ChefBillSocketEvent.NEW_BILL, b);
        socketServer.of(SocketRoute.staffBill)
            .emit(StaffBillSocketEvent.AMOUNT_PREPARED_BILL_DISH_CHANGE, b.toStaffSocketBill());

        return b;
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
        delete bill.histories;

        AuthorizationStore(await UserService.getOne({ uuid: data.updateByUuid }, { withStores: true }), bill.store.id);

        // Save data
        if (data.tableNumber) {
            bill.tableNumber = data.tableNumber;
        }
        // Create new history if dishIds existed.
        if (data.dishIds &&
            !arrayCompare(data.dishIds.map(i => parseInt(i.toString(), 10)), bill.dishes.map(i => i.dishId))) {
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
            } catch (_e) {
                throw new Error(__('bill.prepared_user_not_found'));
            }
        }
        if (data.prepareByUuid === '') {
            bill.prepareBy = null;
            bill.prepareAt = null;
        }

        if (data.collectAt) {
            bill.collectAt = data.collectAt;
        }
        if (data.collectValue !== null && data.collectValue !== undefined) {
            bill.collectValue = data.collectValue;
        }
        if (data.collectByUuid) {
            try {
                bill.collectBy = await UserService.getOne({ uuid: data.collectByUuid });
            } catch (_e) {
                throw new Error(__('bill.collected_user_not_found'));
            }
        }
        if (data.collectByUuid === '') { // Remove time :v
            bill.collectBy = null;
            bill.collectAt = null;
            bill.collectValue = null;
        }

        if (data.rating !== null && data.rating !== undefined) {
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
            withCollectBy: true,
            withCreateBy: true,
            withCustomer: true,
            withPrepareBy: true,
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

        await this.edit(id, data);

        return await this.getOne(id, {
            withCollectBy: true,
            showDishesType: 'dishes',
            withCreateBy: true,
            withCustomer: true,
            withPrepareBy: true,
            withStore: true
        });
    }

    /**
     * Select bill to prepare for chef
     */
    public async prepareBill(id: number, data: { prepareByUuid: string }) {
        const bill = await this.getOne(id, { withPrepareBy: true, withCreateBy: true });

        const oldPrepareBy = bill.prepareBy;
        if (oldPrepareBy) {
            if (oldPrepareBy.uuid === data.prepareByUuid) {
                throw new Error(__('bill.you_selected_to_prepare_this_bill'));
            } else {
                throw new Error(__('bill.bill_is_selected_by_other_chef'));
            }
        }

        const editedBill = await this.edit(id, {
            updateByUuid: data.prepareByUuid, prepareByUuid: data.prepareByUuid, prepareAt: new Date()
        });

        // Notify to other chefs
        socketServer.of(SocketRoute.chefBill)
            .emit(ChefBillSocketEvent.NEW_BILL_IS_SELECTED, { id: editedBill.id, prepareBy: editedBill.prepareBy });

        // Notify too chef
        socketServer.of(SocketRoute.chefBill)
            .to(data.prepareByUuid)
            .emit(ChefBillSocketEvent.NEW_PREPARE_BILL, editedBill);

        socketServer.of(SocketRoute.staffBill)
            .to(bill.createBy.uuid)
            .emit(StaffBillSocketEvent.AMOUNT_PREPARED_BILL_DISH_CHANGE, editedBill.toStaffSocketBill());

        return editedBill;
    }

    /**
     * For chef
     * @param id Bill Id.
     * @param editBy
     * @param dishId Prepared all if dish id is null.
     */
    public async preparedBillDish(id: number, editBy: User, dishId?: number) {
        const prepareBy = (await this.getOne(id, { withPrepareBy: true })).prepareBy;

        if (prepareBy && prepareBy.uuid !== editBy.uuid) {
            throw new Error(__('bill.can_not_edit_bill_of_other_chef'));
        } else if (!prepareBy) {
            throw new Error(__('bill.you_have_not_selected_this_bill_yet'));
        }

        const bill = await this.getOne(id, {
            showDishesType: 'dishes', withCollectBy: true, withCreateBy: true, withCustomer: true,
            withPrepareBy: true, withStore: true
        });
        const histories = bill.histories;
        if (bill.histories.length === 0) {
            throw new Error(__('bill.bill_does_not_have_history'));
        }

        if (dishId) {
            await BillDishService.prepared(dishId, histories[histories.length - 1].id);

            // Notify staff about new dish prepared
            socketServer.of(SocketRoute.staffBill)
                .to(bill.createBy.uuid)
                .emit(StaffBillSocketEvent.AMOUNT_PREPARED_BILL_DISH_CHANGE, (await this.getOne(id, {
                    showDishesType: 'dishes', withCollectBy: true, withCreateBy: true, withCustomer: true,
                    withPrepareBy: true, withStore: true
                })).toStaffSocketBill());
        } else {
            const dishes = (await BillHistoryService.getOne(
                id, histories[histories.length - 1].id, { withDishes: true })).dishes;
            for (const dish of dishes) {
                await BillDishService.prepared(dish.dishId, dish.billHistoryId);

                // Notify staff about new dish prepared
                socketServer.of(SocketRoute.staffBill)
                    .to(bill.createBy.uuid)
                    .emit(StaffBillSocketEvent.AMOUNT_PREPARED_BILL_DISH_CHANGE, (await this.getOne(id, {
                        showDishesType: 'dishes', withCollectBy: true, withCreateBy: true, withCustomer: true,
                        withPrepareBy: true, withStore: true
                    })).toStaffSocketBill());

                // Notify about prepared bill
                socketServer.of(SocketRoute.chefBill)
                    .to(editBy.uuid)
                    .emit(ChefBillSocketEvent.NEW_PREPARED_BILL, (await this.getOne(id, {
                        showDishesType: 'dishes', withCollectBy: true, withCreateBy: true, withCustomer: true,
                        withPrepareBy: true, withStore: true
                    })));
            }
        }

        return await this.getOne(id, {
            showDishesType: 'dishes', withCollectBy: true, withCreateBy: true, withCustomer: true,
            withPrepareBy: true, withStore: true
        });
    }

    /**
     * For staff
     * @param id Bill id
     * @param editBy Staff who edit
     * @param dishId Dish id, if null is delivered all
     */
    public async deliveredBillDish(id: number, editBy: User, dishId?: number) {
        const bill = await this.getOne(id, {
            showDishesType: 'dishes', withCollectBy: true, withCreateBy: true,
            withCustomer: true, withPrepareBy: true, withStore: true
        });
        const createBy = bill.createBy;
        const prepareBy = bill.prepareBy;

        if (createBy && createBy.uuid !== editBy.uuid) {
            throw new Error(__('bill.can_not_edit_bill_of_other_staff'));
        }
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

        // Notify chef
        socketServer.of(SocketRoute.chefBillDetail)
            .to(prepareBy.uuid + id)
            .emit(ChefBillDetailSocketEvent.NEW_DELIVERED_BILL_DISH, await this.getOne(id, {
                showDishesType: 'dishes', withCollectBy: true, withCreateBy: true, withCustomer: true,
                withPrepareBy: true, withStore: true
            }));

        // Notify staff
        socketServer.of(SocketRoute.staffBill)
            .to(createBy.uuid)
            .emit(StaffBillSocketEvent.AMOUNT_PREPARED_BILL_DISH_CHANGE, (await this.getOne(id, {
                showDishesType: 'dishes', withCollectBy: true, withCreateBy: true, withCustomer: true,
                withPrepareBy: true, withStore: true
            })).toStaffSocketBill());

        return await this.getOne(id, {
            showDishesType: 'dishes', withCollectBy: true, withCreateBy: true, withCustomer: true,
            withPrepareBy: true, withStore: true
        });
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
            } catch (_e) {
                throw new Error(__('bill.collected_user_not_found'));
            }
        }

        await bill.save();

        return await this.getOne(id, {
            withCollectBy: true, showDishesType: 'dishes', withCreateBy: true,
            withCustomer: true, withPrepareBy: true, withStore: true
        });
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
        if (options?.withCollectBy) {
            relations.push('collectBy');
        }
        if (options?.withCreateBy) {
            relations.push('createBy');
        }
        if (options?.withCustomer) {
            relations.push('customer');
        }
        if (options?.withPrepareBy) {
            relations.push('prepareBy');
        }
        if (options?.withStore) {
            relations.push('store');
        }

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
                // delete bill.histories;
            } else {
                bill['updateAt'] = null;
                bill['updateBy'] = null;
                bill['dishes'] = [];
                // delete bill.histories;
            }
        }

        return bill;
    }
}

const billService = new BillService();

export { billService as BillService };
