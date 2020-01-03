import { __ } from 'i18n';
import { DailyReport } from '../entity/dailyReport';
import { User } from '../entity/user';
import { Warehouse } from '../entity/warehouse';
import { StoreService } from './store.service';

class WarehouseService {
    public async getAll(options?: {
        length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1',
        user?: User
    }) {
        const order = options.orderId
            ? { [options.orderId]: options.orderType === 'DESC' || options.orderType === '-1' ? -1 : 1 } : {};
        const skip = (options.page - 1) * options.length >= 0 ? (options.page - 1) * options.length : 0;
        const take = options.length;

        const warehouses = await Warehouse.find({ take, skip, order, relations: ['store'] });

        if (options.user) {
            warehouses.filter(e => options.user.warehouses.find(e2 => e2.id.toString() === e.id.toString()));
        }

        return warehouses;
    }

    public async create(data: {
        name: string, address: string, hotline: string, description?: string, storeId?: number
    }) {
        if (!data.name || !data.address || !data.hotline) {
            throw new Error(__('error.missing_required_information'));
        }

        const newWarehouse = new Warehouse();
        newWarehouse.name = data.name;
        newWarehouse.address = data.address;
        newWarehouse.hotline = data.hotline;
        if (data.description) { newWarehouse.description = data.description; }
        if (data.storeId) { newWarehouse.store = await StoreService.getOne(data.storeId); }

        const warehouse = await newWarehouse.save({ reload: true });
        if (!warehouse) { throw new Error(__('warehouse.create_fail')); }

        return this.getOne(warehouse.id, {
            withImportBills: true,
            withReports: true,
            withStore: true
        });
    }

    public async edit(id: number, data: {
        name?: string, address?: string, hotline?: string, description?: string, storeId?: number
    }) {
        const warehouse = await Warehouse.findOne(id);

        if (!warehouse) {
            throw new Error(__('warehouse.warehouse_not_found'));
        }

        if (data.name) { warehouse.name = data.name; }
        if (data.address) { warehouse.address = data.address; }
        if (data.hotline) { warehouse.hotline = data.hotline; }
        if (data.description) { warehouse.description = data.description; }
        if (data.storeId) { warehouse.store = await StoreService.getOne(data.storeId); }

        await warehouse.save();

        return this.getOne(warehouse.id, {
            withImportBills: true,
            withReports: true,
            withStore: true
        });
    }

    public async delete(id: number) {
        const warehouse = await Warehouse.findOne(id);

        if (!warehouse) {
            throw new Error(__('warehouse.warehouse_not_found'));
        }

        await warehouse.remove();
    }

    public async deleteMany(ids: number[]) {
        try {
            await Promise.all(
                ids.map(id => this.delete(id))
            );
        // tslint:disable-next-line: no-empty
        } catch (_) { }
    }

    public async getOne(id: number, options?: {
        withImportBills?: boolean, withReports?: boolean, withStore?: boolean
    }) {
        const relations = ['warehouseStocks'];

        if (options?.withImportBills) { relations.push('importBills'); }
        if (options?.withReports) { relations.push('dailyReports'); }
        if (options?.withStore) { relations.push('store'); }

        const warehouse = await Warehouse.findOne(id, { relations });

        if (!warehouse) {
            throw new Error(__('warehouse.warehouse_not_found'));
        }

        return warehouse;
    }

    public async updateStockQuantityByReport(id: number, dailyReport: DailyReport) {
        const warehouse = await Warehouse.findOne(id);

        if (!warehouse) {
            throw new Error(__('warehouse.warehouse_not_found'));
        }

        const warehouseStocks = warehouse.warehouseStocks;

        for (const reportStock of dailyReport.stocks) {
            const index = warehouseStocks.findIndex(i => i.stockId === reportStock.stockId);

            if (index !== -1) {
                if (warehouseStocks[index].quantity < reportStock.quantity) {
                    throw new Error(
                        __('warehouse.error_report_get_{{get_number}}_stocks_id_{{stock_id}}_but_warehouse_just_have_{{cur_number}}',
                            {
                                stock_id: reportStock.stockId.toString(),
                                get_number: reportStock.quantity.toString(),
                                cur_number: warehouseStocks[index].quantity.toString()
                            }
                        )
                    );
                }

                warehouseStocks[index].quantity -= reportStock.quantity;
                await warehouseStocks[index].save();
            } else {
                throw new Error(
                    __('warehouse.warehouse_do_not_have_stock_id_{{id}}', { id: reportStock.stockId.toString() }));
            }
        }

        warehouse.warehouseStocks = warehouseStocks;

        return await warehouse.save();
    }
}

const warehouseService = new WarehouseService();

export { warehouseService as WarehouseService };
