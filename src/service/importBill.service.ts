import { __ } from 'i18n';
import { getManager } from 'typeorm';
import { ImportBill } from '../entity/importBill';
import { ImportBillStock } from '../entity/importBillStock';
import { Stock } from '../entity/stock';
import { User } from '../entity/user';
import { Warehouse } from '../entity/warehouse';
import { WarehouseStock } from '../entity/warehouseStock';

class ImportBillService {
    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const importBill = await ImportBill.find({ take, skip, order, relations: ['stocks'] });

        return importBill;
    }

    public async create(data: {
        stockIds: number[], quantities: number[], warehouseId: number, username: string,
        note?: string, stockPrices?: number[], stockNotes?: string[]
    }) {
        if (!data.stockIds || !data.quantities || !data.warehouseId || !data.username) {
            throw new Error(__('error.missing_required_information'));
        }

        if (data.quantities.length !== data.stockIds.length) {
            throw new Error(__('import_bill.stockIds_length_have_to_equal_quantities_length'));
        }

        if (data.stockPrices && data.stockPrices.length !== data.stockIds.length) {
            throw new Error(__('import_bill.stockIds_length_have_to_equal_stockPrices_length'));
        }

        if (data.stockNotes && data.stockNotes.length !== data.stockIds.length) {
            throw new Error(__('import_bill.stockIds_length_have_to_equal_stockNotes_length'));
        }

        const warehouse = await Warehouse.findOne(data.warehouseId);
        if (!warehouse) {
            throw new Error(__('import_bill.warehouse_not_found'));
        }

        const user = await User.findOne({ where: { username: data.username } });
        if (!user) {
            throw new Error(__('import_bill.user_{{username}}_not_found', { username: data.username }));
        }

        const newImportBill = new ImportBill();
        newImportBill.warehouse = warehouse;
        newImportBill.user = user;
        newImportBill.note = data.note;

        const importBill = await newImportBill.save();

        const wsRepo = getManager().getRepository(WarehouseStock);
        const warehouseStocks = await WarehouseStock.find({ where: { warehouseId: warehouse.id } });

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.stockIds.length; i++) {
            const stock = await Stock.findOne(data.stockIds[i]);
            if (!stock) {
                throw new Error(__('import_bill.stock_{{id}}_not_found', { id: data.stockIds[i].toString() }));
            }

            const importBillStock = new ImportBillStock();
            importBillStock.stock = stock;
            importBillStock.quantity = data.quantities[i];
            importBillStock.price = data.stockPrices ? data.stockPrices[i] : stock.price;
            importBillStock.note = data.stockNotes ? data.stockNotes[i] : null;
            importBillStock.importBill = importBill;

            await importBillStock.save();

            // Update warehouse stock quantity
            const index = warehouseStocks.findIndex(it => it.stockId === importBillStock.stock.id);

            if (index !== -1) {
                warehouseStocks[index].quantity += importBillStock.quantity;
                warehouseStocks[index].warehouse = warehouse;
                wsRepo.save(warehouseStocks[index]);
            } else {
                const newWare = new WarehouseStock();
                newWare.quantity = importBillStock.quantity;
                newWare.stock = importBillStock.stock;
                newWare.warehouse = warehouse;
                wsRepo.save(newWare);
            }
            await warehouse.save();
        }

        return await ImportBill.findOne(importBill.id, { relations: ['user', 'stocks'] });
    }

    public async edit(id: number, data: { username?: string, note?: string }) {
        const importBill = await ImportBill.findOne(id);
        if (!importBill) {
            throw new Error(__('import_bill.import_bill_not_found'));
        }

        if (data.username) {
            const user = await User.findOne({ where: { username: data.username } });
            if (!user) {
                throw new Error(__('import_bill.user_{{username}}_not_found', { username: data.username }));
            }

            importBill.user = user;
        }

        if (data.note) {
            importBill.note = data.note;
        }

        await importBill.save();

        return await ImportBill.findOne(id, { relations: ['user'] });
    }

    public async delete(id: number) {
        const importBill = await ImportBill.findOne(id, { relations: ['stocks'] });

        if (!importBill) {
            throw new Error(__('import_bill.import_bill_not_found'));
        }
        const warehouse = await Warehouse.findOne(importBill.warehouse.id, { relations: ['warehouseStocks'] });

        // Update warehouse stock quantity
        const warehouseStocks = warehouse.warehouseStocks;

        for (const billStock of importBill.stocks) {
            const index = warehouseStocks.findIndex(i => i.stockId === billStock.stockId);

            if (index !== -1) {
                warehouseStocks[index].quantity -= billStock.quantity;
                warehouseStocks[index].warehouse = warehouse;
                await warehouseStocks[index].save();
            }
        }

        // End - Update warehouse stock quantity

        await importBill.remove();
    }

    public async getOne(id: number, options?: { withUser?: boolean }) {
        const relations = [];
        if (options?.withUser) { relations.push('user'); }

        const importBill = await ImportBill.findOne(id, { relations });

        if (!importBill) {
            throw new Error(__('import_bill.import_bill_not_found'));
        }

        return importBill;
    }
}

const importBillService = new ImportBillService();

export { importBillService as ImportBillService };
