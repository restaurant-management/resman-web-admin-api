import { __ } from 'i18n';
import { DeliveryBillDish } from '../entity/deliveryBillDish';
import { BillHistoryService } from './billHistory.service';
import { DeliveryBillService } from './deliveryBill.service';
import { DishService } from './dish.service';

class DeliveryBillDishService {
    public async getAll(billHistoryId: number, billId: number,
        options?: { length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1' }) {

        await BillHistoryService.getOne(billId, billHistoryId);

        const order = options?.orderId
            ? { [options?.orderId]: options?.orderType === 'DESC' || options?.orderType === '-1' ? -1 : 1 }
            : {};
        const skip = (options?.page - 1) * options?.length >= 0 ? (options?.page - 1) * options?.length : 0;
        const take = options?.length;

        const deliveryBillDish = await DeliveryBillDish.find({ take, skip, order, where: { billHistoryId } });

        return deliveryBillDish;
    }

    public async create(deliveryBillId: number,
        data: { dishId: number, note?: string, quantity?: number }) {
        const dish = await DishService.getOne(data.dishId);

        // Create new bill dish
        const deliveryBillDish = new DeliveryBillDish();
        deliveryBillDish.deliveryBill = await DeliveryBillService.getOne(deliveryBillId);
        deliveryBillDish.dish = dish;
        deliveryBillDish.note = data.note || '';
        deliveryBillDish.quantity = data.quantity || 1;
        deliveryBillDish.name = dish.name;
        deliveryBillDish.price = await DishService.getRealPrice({ dish });

        await deliveryBillDish.save();

        return await this.getOne(dish.id, deliveryBillId);
    }

    public async edit(dishId: number, deliveryBillId: number, data: { note?: string, quantity?: number }) {

        if (data === {}) { return; }

        const deliveryBillDish = await this.getOne(dishId, deliveryBillId);

        if (data.note) { deliveryBillDish.note = data.note; }
        if (data.quantity) { deliveryBillDish.quantity = data.quantity; }

        await deliveryBillDish.save();

        return await this.getOne(dishId, deliveryBillId);
    }

    public async delete(dishId: number, billHistoryId: number) {

        const deliveryBillDish = await this.getOne(dishId, billHistoryId);

        if (!deliveryBillDish) {
            throw new Error(__('delivery_bill_dish.delivery_bill_dish_not_found'));
        }

        await deliveryBillDish.remove();
    }

    public async getOne(dishId: number, deliveryBillId: number) {

        const deliveryBillDish = await DeliveryBillDish.findOne({ where: { dishId, deliveryBillId } });

        if (!deliveryBillDish) {
            throw new Error(__('delivery_bill_dish.delivery_bill_dish_not_found'));
        }

        return deliveryBillDish;
    }
}

const deliveryBillDishService = new DeliveryBillDishService();

export { deliveryBillDishService as DeliveryBillDishService };
