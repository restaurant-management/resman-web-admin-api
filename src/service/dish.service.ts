import { __ } from 'i18n';
import { FindConditions, getConnection, ObjectLiteral } from 'typeorm';
import { Dish } from '../entity/dish';

class DishService {
    public async getAll(options: {
        length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1' // Paging
        where?: Array<FindConditions<Dish>> | FindConditions<Dish> | ObjectLiteral | string;
    }) {
        const order = options.orderId ?
            { [options.orderId]: options.orderType === 'DESC' || options.orderType === '-1' ? -1 : 1 } : {};
        const skip = (options.page - 1) * options.length >= 0 ? (options.page - 1) * options.length : 0;
        const take = options.length;

        const dish = await Dish.find({ take, skip, order, where: {} });

        return dish;
    }

    public async create(data: { name: string, description?: string, images?: string[], defaultPrice?: number }) {
        const newDish = new Dish();
        newDish.name = data.name;
        newDish.images = data.images || [];
        newDish.defaultPrice = data.defaultPrice || 0;
        if (data.description) { newDish.description = data.description; }

        const dish = await newDish.save({ reload: true });
        if (!dish) { throw new Error(__('dish.create_fail')); }

        return await this.getOne(dish.id);
    }

    public async edit(id: number,
        data: { name?: string, description?: string, images?: string[], defaultPrice?: number }) {

        const dish = await this.getOne(id);
        if (!dish) { throw new Error(__('dish.dish_not_found')); }
        if (data.name) { dish.name = data.name; }
        if (data.description) { dish.description = data.description; }
        dish.images = data.images ? data.images : [];
        if (data.defaultPrice) { dish.defaultPrice = data.defaultPrice || 0; }

        await dish.save();

        return await this.getOne(id);
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
