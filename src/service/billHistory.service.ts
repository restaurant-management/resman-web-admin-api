import { __ } from 'i18n';
import { Bill } from '../entity/bill';
import { BillHistory } from '../entity/billHistory';
import { DaySession } from '../entity/dailyDish';
import { BillService } from './bill.service';
import { BillDishService } from './billDish.service';
import { DailyDishService } from './dailyDish.service';
import { DishService } from './dish.service';
import { UserService } from './user.service';

class BillHistoryService {
    public async getAll(billId: number,
        options?: { length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1' }) {

        await BillService.getOne(billId);

        const order = options?.orderId
            ? { [options?.orderId]: options?.orderType === 'DESC' || options?.orderType === '-1' ? -1 : 1 }
            : {};
        const skip = (options?.page - 1) * options?.length >= 0 ? (options?.page - 1) * options?.length : 0;
        const take = options?.length;

        const billHistory = await BillHistory.find({ take, skip, order, where: { billId } });

        return billHistory;
    }

    public async create(billId: number, data: {
        dishIds: number[], userUuid: string,
        dishNotes?: string[], dishQuantities?: number[], description?: string, createAt?: Date
    }) {
        const time = data.createAt || new Date();
        const bill = await BillService.getOne(billId, { showDishesType: 'dishes', withStore: true });

        // Check whether dish is daily dish.
        for (const dishId of data.dishIds) {
            await DailyDishService.getOne({ day: time, dishId, session: DaySession.None, storeId: bill.store.id });
        }

        const newBillHistory = new BillHistory();
        newBillHistory.bill = bill;
        newBillHistory.description = data.description;
        newBillHistory.createAt = time;
        newBillHistory.user = await UserService.getOne({ uuid: data.userUuid });

        const billHistory = await newBillHistory.save({ reload: true });
        if (!billHistory) { throw new Error(__('bill_history.create_fail')); }

        for (const [index, dishId] of data.dishIds.entries()) {
            const oldBillDish = bill['dishes'].find((item) => item.dishId === dishId);
            const dishNotes = data.dishNotes || [];
            const dishQuantities = data.dishQuantities || [];

            await BillDishService.create(billHistory.id, billId,
                {
                    dishId,
                    note: dishNotes[index] || oldBillDish?.note,
                    quantity: dishQuantities[index] || oldBillDish?.quantity,
                    preparedAt: oldBillDish?.preparedAt,
                    deliveredAt: oldBillDish?.deliveryAt
                });
        }

        return billHistory;
    }

    public async createRaw(data: {
        dishIds: number[], userUuid: string, storeId: number, description?: string, createAt?: Date
    }): Promise<BillHistory> {
        const time = data.createAt || new Date();

        const dishes = [];
        for (const dishId of data.dishIds) {
            // Check whether dish is daily dish.
            await DailyDishService.getOne({ day: time, dishId, session: DaySession.None, storeId: data.storeId });
            // Add to list dishes
            dishes.push(await DishService.getOne(dishId));
        }

        const newBillHistory = new BillHistory();
        newBillHistory.dishes = dishes;
        newBillHistory.description = data.description;
        newBillHistory.createAt = time;
        newBillHistory.user = await UserService.getOne({ uuid: data.userUuid });

        return newBillHistory;
    }

    public async edit(billId: number, id: number,
        data: { dishIds?: number[], userUuid?: string, description?: string, time?: Date }) {

        if (data === {}) { return; }

        const billHistory = await this.getOne(billId, id);

        if (data.dishIds) {
            const dishes = [];
            for (const dishId of data.dishIds) {
                dishes.push(await DishService.getOne(dishId));
            }
            billHistory.dishes = dishes;
        }

        if (data.userUuid) { billHistory.user = await UserService.getOne({ uuid: data.userUuid }); }
        if (data.description) { billHistory.description = data.description; }
        if (data.time) { billHistory.createAt = data.time; }

        await billHistory.save();

        return await this.getOne(billId, id, { withUser: !!data.userUuid, withDishes: !!data.dishIds, withBill: true });
    }

    public async delete(billId: number, id: number) {

        await BillService.getOne(billId);

        const billHistory = await BillHistory.findOne(id);

        if (!billHistory) {
            throw new Error(__('bill_history.bill_history_not_found'));
        }

        await billHistory.remove();
    }

    public async getOne(billId: number, id: number,
        options?: { withDishes?: boolean, withUser?: boolean, withBill?: boolean }) {

        if (!await Bill.findOne(billId)) {
            throw new Error(__('bill_history.bill_not_found'));
        }

        const relations = [];
        if (options?.withBill) { relations.push('bill'); }
        if (options?.withDishes) { relations.push('dishes'); }
        if (options?.withUser) { relations.push('user'); }

        const billHistory = await BillHistory.findOne(id, { relations });

        if (!billHistory) {
            throw new Error(__('bill_history.bill_history_not_found'));
        }

        return billHistory;
    }
}

const billHistoryService = new BillHistoryService();

export { billHistoryService as BillHistoryService };
