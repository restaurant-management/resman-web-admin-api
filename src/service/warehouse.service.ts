import { __ } from 'i18n';
import { Warehouse } from '../entity/warehouse';

class WarehouseService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const warehouse = await Warehouse.find({ take, skip, order });

        return warehouse;
    }

    public async create(name: string, address: string, hotline: string, description?: string) {
        const newWarehouse = new Warehouse();
        newWarehouse.name = name;
        newWarehouse.address = address;
        newWarehouse.hotline = hotline;
        if (description) { newWarehouse.description = description; }

        const warehouse = await newWarehouse.save({ reload: true });
        if (!warehouse) { throw new Error(__('warehouse.create_fail')); }

        return warehouse;
    }

    public async edit(id: number, name?: string, address?: string, hotline?: string, description?: string) {
        const warehouse = await Warehouse.findOne(id);

        if (name) { warehouse.name = name; }
        if (address) { warehouse.address = address; }
        if (hotline) { warehouse.hotline = hotline; }
        if (description) { warehouse.description = description; }

        return await warehouse.save();
    }

    public async delete(id: number) {
        const warehouse = await Warehouse.findOne(id);

        if (!warehouse) {
            throw new Error(__('warehouse.warehouse_not_found'));
        }

        await warehouse.remove();
    }

    public async getOne(id: number) {
        const warehouse = await Warehouse.findOne(id);

        if (!warehouse) {
            throw new Error(__('warehouse.warehouse_not_found'));
        }

        return warehouse;
    }
}

const warehouseService = new WarehouseService();

export { warehouseService as WarehouseService };