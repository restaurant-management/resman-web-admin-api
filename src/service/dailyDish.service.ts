import { __ } from 'i18n';
import { DailyDish, DaySession } from '../entity/dailyDish';
import { onlyDate } from '../helper/onlyDate';
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
            throw new Error(__('daily_dish.session_not_found'));
        }

        const dish = await DishService.getOne(dishId);
        if (!dish) { throw new Error(__('daily_dish.dish_not_found')); }

        const store = await StoreService.getOne(storeId);
        if (!store) { throw new Error(__('daily_dish.store_not_found')); }

        if (await this.getOne({ day, dishId, storeId, session: session || DaySession.None })) {
            throw new Error(__('daily_dish.existed'));
        }

        const newDailyDish = new DailyDish();
        newDailyDish.day = day;
        newDailyDish.session = session as DaySession;
        newDailyDish.dish = dish;
        newDailyDish.store = store;

        const dailyDish = await newDailyDish.save({ reload: true });
        if (!dailyDish) { throw new Error(__('daily_dish.create_fail')); }

        return await this.getOne({ day: dailyDish.day, dishId: dailyDish.dish.id, session: dailyDish.session });
    }

    public async edit(day: Date, dishId: number, session: string, storeId?: number, confirmByUsername?: string,
        confirmAt?: Date) {
        const dailyDish = await this.getOne({ day, dishId, session });
        if (!dailyDish) { throw new Error(__('daily_dish.daily_dish_not_found')); }

        // Update store whether storeID exist
        if (storeId) {
            const store = await StoreService.getOne(storeId);
            if (!store) { throw new Error(__('daily_dish.store_not_found')); }

            dailyDish.store = store;
        }

        if (confirmByUsername) {
            dailyDish.confirmBy = await UserService.getOne({ username: confirmByUsername });
            dailyDish.confirmAt = confirmAt || new Date();
        }

        await dailyDish.save();

        return await this.getOne({ day, dishId, session });
    }

    public async delete(key: { day: Date, dishId: number, session: string, storeId: number }) {
        if (!key.day || !key.dishId || !key.session) {
            throw new Error(__('error.missing_required_information'));
        }

        if (onlyDate(key.day) < onlyDate(new Date())) {
            throw new Error(__('daily_dish.error_can_not_delete_old_daily_dish'));
        }

        const dailyDish = await this.getOne(key);
        await dailyDish.remove();
    }

    // TODO fix get one with storeId
    public async getOne(key: { day?: Date, dishId?: number, session?: string, storeId?: number }) {
        const dailyDish = await DailyDish.findOne({
            relations: ['confirmBy', 'dish'],
            where: { ...key }
        });

        if (dailyDish) {
            dailyDish.dish['price'] = await DishService.getRealPrice({ dish: dailyDish.dish });

            return dailyDish;
        }
        throw new Error(__('daily_dish.daily_dish_not_found'));
    }

    public async getBy(key: { day?: Date, dishId?: number, session?: string, storeId?: number }) {
        const dailyDishes = await DailyDish.find({
            relations: ['confirmBy', 'dish', 'store'],
            where: { ...key }
        });

        dailyDishes.map(async item => {
            item.dish['price'] = await DishService.getRealPrice({ dish: item.dish });

            return item;
        });

        return dailyDishes;
    }
}

const dailyDishService = new DailyDishService();

export { dailyDishService as DailyDishService };
