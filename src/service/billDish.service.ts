import { __ } from 'i18n';
import { BillDish } from '../entity/billDish';
import { BillHistoryService } from './billHistory.service';
import { DishService } from './dish.service';

class BillDishService {
    public async getAll(billHistoryId: number, billId: number,
        options?: { length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1' }) {

        await BillHistoryService.getOne(billId, billHistoryId);

        const order = options?.orderId
            ? { [options?.orderId]: options?.orderType === 'DESC' || options?.orderType === '-1' ? -1 : 1 }
            : {};
        const skip = (options?.page - 1) * options?.length >= 0 ? (options?.page - 1) * options?.length : 0;
        const take = options?.length;

        const billDish = await BillDish.find({ take, skip, order, where: { billHistoryId } });

        return billDish;
    }

    public async create(billHistoryId: number, billId: number,
        data: { dishId: number, note?: string, quantity?: number, preparedAt?: Date, deliveredAt?: Date }) {
        const dish = await DishService.getOne(data.dishId);

        // Create new bill dish
        const billDish = new BillDish();
        billDish.dish = dish;
        billDish.billHistory = await BillHistoryService.getOne(billId, billHistoryId);
        billDish.note = data.note || '';
        billDish.quantity = data.quantity || 1;
        billDish.preparedAt = data.preparedAt;
        billDish.deliveryAt = data.deliveredAt;
        billDish.price = await DishService.getRealPrice({ dish });

        await billDish.save();

        return await this.getOne(dish.id, billHistoryId);
    }

    public async createFrom(billHistoryId: number, billId: number,
        otherBillDish: { billHistoryId: number, dishId: number }) {
        const billDish = await this.getOne(otherBillDish.dishId, otherBillDish.billHistoryId);
        const dish = await DishService.getOne(otherBillDish.dishId);

        // Create new bill dish
        const newBillDish = new BillDish();
        newBillDish.dish = dish;
        newBillDish.billHistory = await BillHistoryService.getOne(billId, billHistoryId);
        newBillDish.note = billDish.note;
        newBillDish.quantity = billDish.quantity || 1;
        newBillDish.preparedAt = billDish.preparedAt;
        newBillDish.deliveryAt = billDish.deliveryAt;
        newBillDish.price = await DishService.getRealPrice({ dish });

        await newBillDish.save();

        return await this.getOne(dish.id, billHistoryId);

    }

    public async edit(dishId: number, billHistoryId: number, data: { note?: string, quantity?: number }) {

        if (data === {}) { return; }

        const billDish = await this.getOne(dishId, billHistoryId);

        if (data.note) { billDish.note = data.note; }
        if (data.quantity) { billDish.quantity = data.quantity; }

        await billDish.save();

        return await this.getOne(dishId, billHistoryId);
    }

    public async delete(dishId: number, billHistoryId: number) {

        const billDish = await this.getOne(dishId, billHistoryId);

        if (!billDish) {
            throw new Error(__('bill_dish.bill_dish_not_found'));
        }

        await billDish.remove();
    }

    public async getOne(dishId: number, billHistoryId: number) {

        const billDish = await BillDish.findOne({ where: { dishId, billHistoryId } });

        if (!billDish) {
            throw new Error(__('bill_dish.bill_dish_not_found'));
        }

        return billDish;
    }

    public async prepared(dishId: number, billHistoryId: number) {
        const dish = await this.getOne(dishId, billHistoryId);
        dish.preparedAt = new Date();
        await dish.save();
    }

    public async delivered(dishId: number, billHistoryId: number) {
        const dish = await this.getOne(dishId, billHistoryId);
        if (!dish.preparedAt) {
            throw new Error(__('bill_dish.dish_is_not_prepared_yet'));
        }

        dish.deliveryAt = new Date();
        await dish.save();

        return this.getOne(dishId, billHistoryId);
    }
}

const billDishService = new BillDishService();

export { billDishService as BillDishService };
