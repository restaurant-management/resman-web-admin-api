import { __ } from 'i18n';
import { Stock } from '../entity/stock';

class StockService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const stock = await Stock.find({ take, skip, order });

        return stock;
    }

    public async create(data: {
        name: string, price: number, unit: string, image: string
    }) {
        const newStock = new Stock();
        newStock.name = data.name;
        newStock.price = data.price;
        newStock.unit = data.unit;
        newStock.image = data.image;

        const stock = await newStock.save({ reload: true });
        if (!stock) { throw new Error(__('stock.create_fail')); }

        return stock;
    }

    public async edit(id: number, data: { name?: string, price?: number, unit?: string, image?: string }) {
        const stock = await Stock.findOne(id);

        if (data.name) { stock.name = data.name; }
        if (data.price) { stock.price = data.price; }
        if (data.unit) { stock.unit = data.unit; }
        if (data.image) { stock.image = data.image; }

        return await stock.save();
    }

    public async delete(id: number) {
        const stock = await Stock.findOne(id);

        if (!stock) {
            throw new Error(__('stock.stock_not_found'));
        }

        await stock.remove();
    }

    public async getOne(id: number) {
        const stock = await Stock.findOne(id);

        if (!stock) {
            throw new Error(__('stock.stock_not_found'));
        }

        return stock;
    }
}

const stockService = new StockService();

export { stockService as StockService };
