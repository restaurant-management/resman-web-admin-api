import { __ } from 'i18n';
import { getManager } from 'typeorm';
import { DailyReport } from '../entity/dailyReport';
import { DailyReportStock } from '../entity/dailyReportStock';
import { Stock } from '../entity/stock';
import { User } from '../entity/user';
import { Warehouse } from '../entity/warehouse';
import { WarehouseStock } from '../entity/warehouseStock';

class DailyReportService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const dailyReport = await DailyReport.find({ take, skip, order, relations: ['stocks'] });

        return dailyReport;
    }

    public async create(stockIds: number[], quantities: number[], warehouseId: number, username: string,
        note?: string, stockPrices?: number[], stockNotes?: string[]) {
        if (!stockIds || !quantities || !warehouseId || !username) {
            throw new Error(__('error.missing_required_information'));
        }

        if (quantities.length !== stockIds.length) {
            throw new Error(__('daily_report.stockIds_length_have_to_equal_quantities_length'));
        }

        if (stockPrices && stockPrices.length !== stockIds.length) {
            throw new Error(__('daily_report.stockIds_length_have_to_equal_stockPrices_length'));
        }

        if (stockNotes && stockNotes.length !== stockIds.length) {
            throw new Error(__('daily_report.stockIds_length_have_to_equal_stockNotes_length'));
        }

        const warehouse = await Warehouse.findOne(warehouseId);
        if (!warehouse) {
            throw new Error(__('daily_report.warehouse_not_found'));
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new Error(__('daily_report.user_{{username}}_not_found', { username }));
        }

        const newDailyReport = new DailyReport();
        newDailyReport.warehouse = warehouse;
        newDailyReport.user = user;
        newDailyReport.note = note;

        const dailyReport = await newDailyReport.save();

        const wsRepo = getManager().getRepository(WarehouseStock);
        const warehouseStocks = await WarehouseStock.find({ where: { warehouseId: warehouse.id } });

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < stockIds.length; i++) {
            const stock = await Stock.findOne(stockIds[i]);
            if (!stock) {
                throw new Error(__('daily_report.stock_{{id}}_not_found', { id: stockIds[i].toString() }));
            }

            const dailyReportStock = new DailyReportStock();
            dailyReportStock.stock = stock;
            dailyReportStock.quantity = quantities[i];
            dailyReportStock.note = stockNotes ? stockNotes[i] : null;
            dailyReportStock.dailyReport = dailyReport;

            const index = warehouseStocks.findIndex(it => it.stockId === dailyReportStock.stock.id);

            if (index === -1) {
                throw new Error(__('daily_report.stock_{{id}}_not_exist_in_warehouse',
                    { id: stockIds[i].toString() }));
            }

            if (warehouseStocks[index].quantity < dailyReportStock.quantity) {
                throw new Error(__('daily_report.warehouse_not_have_enough_quantity'));
            }

            await dailyReportStock.save();

            // Update warehouse stock quantity
            warehouseStocks[index].quantity -= dailyReportStock.quantity;
            warehouseStocks[index].warehouse = warehouse;
            wsRepo.save(warehouseStocks[index]);
            await warehouse.save();
        }

        return await DailyReport.findOne(dailyReport.id, { relations: ['user', 'stocks'] });
    }

    public async edit(id: number, username?: string, note?: string) {
        const dailyReport = await DailyReport.findOne(id);
        if (!dailyReport) {
            throw new Error(__('daily_report.daily_report_not_found'));
        }

        if (username) {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                throw new Error(__('daily_report.user_{{username}}_not_found', { username }));
            }

            dailyReport.user = user;
        }

        if (note) {
            dailyReport.note = note;
        }

        await dailyReport.save();

        return await DailyReport.findOne(id, { relations: ['user'] });
    }

    public async delete(id: number) {
        const dailyReport = await DailyReport.findOne(id, { relations: ['stocks', 'warehouse'] });

        if (!dailyReport) {
            throw new Error(__('dailyReport.daily_report_not_found'));
        }
        const warehouse = await Warehouse.findOne(dailyReport.warehouse.id, { relations: ['warehouseStocks'] });

        // Update warehouse stock quantity
        const warehouseStocks = warehouse.warehouseStocks;

        for (const billStock of dailyReport.stocks) {
            const index = warehouseStocks.findIndex(i => i.stockId === billStock.stockId);

            if (index !== -1) {
                warehouseStocks[index].quantity += billStock.quantity;
                warehouseStocks[index].warehouse = warehouse;
                await warehouseStocks[index].save();
            }
        }

        // End - Update warehouse stock quantity

        await dailyReport.remove();
    }

    public async getOne(id: number) {
        const dailyReport = await DailyReport.findOne(id);

        if (!dailyReport) {
            throw new Error(__('dailyReport.dailyReport_not_found'));
        }

        return dailyReport;
    }
}

const dailyReportService = new DailyReportService();

export { dailyReportService as DailyReportService };
