import { __ } from 'i18n';
import { getConnection } from 'typeorm';
import { Dish } from '../entity/dish';

class DishService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const dish = await Dish.find({ take, skip, order });

        return dish;
    }

    public async create(name: string, description?: string, images: string[] = [], defaultPrice = 0) {
        const newDish = new Dish();
        newDish.name = name;
        newDish.images = images;
        newDish.defaultPrice = defaultPrice;
        if (description) { newDish.description = description; }

        const dish = await newDish.save({ reload: true });
        if (!dish) { throw new Error(__('dish.create_fail')); }

        return dish;
    }

    public async edit(id: number, _name?: string, _description?: string, _images?: string[], _defaultPrice?: number) {
        const dish = await Dish.findOne(id);
        if (!dish) { throw new Error(__('dish.dish_not_found')); }
        if (_name) { dish.name = _name; }
        if (_description) { dish.description = _description; }
        dish.images = _images ? _images : [];
        if (_defaultPrice) { dish.defaultPrice = _defaultPrice; }

        return await dish.save();
    }

    public async delete(id: number) {
        const result = await getConnection().createQueryBuilder()
            .delete().from(Dish)
            .where('id = :id', { id })
            .execute();
        if (result.affected < 1) { throw new Error(__('dish.delete_fail')); }
    }

    public async getOne(id: number) {
        const dish = await Dish.findOne(id);

        if (dish) { return dish; }
        throw new Error(__('dish.dish_not_found'));
    }

    public async getRealPrice(key: { dish?: Dish, id?: number }) {
        let dish = key.dish;
        if (!dish) {
            dish = await this.getOne(key.id);
        }

        // TODO handle price with discount campaign
        return dish.defaultPrice;
    }
}

const dishService = new DishService();

export { dishService as DishService };
