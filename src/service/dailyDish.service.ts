import { __ } from 'i18n';
import { getConnection } from 'typeorm';
import { DailyDish, DaySession } from '../entity/dailyDish';
import { DishService } from './dish.service';
import { StoreService } from './store.service';
import { UserService } from './user.service';

class DailyDishService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const dailyDishes = await DailyDish.find({ take, skip, order, relations: ['confirmBy'] });

        return dailyDishes;
    }

    public async create(day: Date, dishId: number, storeId: number, session?: string) {
        if (session && Object.keys(DaySession).map(i => DaySession[i]).indexOf(session) < 0) {
            throw new Error(__('dailyDish.session_not_found'));
        }

        const dish = await DishService.getOne(dishId);
        if (!dish) { throw new Error(__('dailyDish.dish_not_found')); }

        const store = await StoreService.getOne(storeId);
        if (!store) { throw new Error(__('dailyDish.store_not_found')); }

        const newDailyDish = new DailyDish();
        newDailyDish.day = day;
        newDailyDish.session = session as DaySession;
        newDailyDish.dish = dish;
        newDailyDish.store = store;

        const dailyDish = await newDailyDish.save({ reload: true });
        if (!dailyDish) { throw new Error(__('dailyDish.create_fail')); }

        return await this.getOne(dailyDish.day, dailyDish.dish.id, dailyDish.session);
    }

    public async edit(day: Date, dishId: number, session: string, storeId?: number, confirmByUsername?: string,
        confirmAt?: Date) {
        const dailyDish = await this.getOne(day, dishId, session);
        if (!dailyDish) { throw new Error(__('dailyDish.daily_dish_not_found')); }

        // Update store whether storeID exist
        if (storeId) {
            const store = await StoreService.getOne(storeId);
            if (!store) { throw new Error(__('dailyDish.store_not_found')); }

            dailyDish.store = store;
        }

        if (confirmByUsername) {
            dailyDish.confirmBy = await UserService.getOne({ username: confirmByUsername }, false);
            dailyDish.confirmAt = confirmAt || new Date();
        }

        await dailyDish.save();

        return await this.getOne(day, dishId, session);
    }

    public async delete(day: Date, dishId: number, session: string) {
        const result = await getConnection().createQueryBuilder()
            .delete().from(DailyDish)
            .where('day=:day', { day })
            .where('dishId=:dishId', { dishId })
            .where('session=:session', { session })
            .execute();
        if (result.affected < 1) { throw new Error(__('dailyDish.delete_fail')); }
    }

    public async getOne(day: Date, dishId: number, session: string) {
        const dailyDish = await DailyDish.findOne({ relations: ['confirmBy'], where: { day, dishId, session } });

        if (dailyDish) { return dailyDish; }
        throw new Error(__('dailyDish.daily_dish_not_found'));
    }
}

const dailyDishService = new DailyDishService();

export { dailyDishService as DailyDishService };
