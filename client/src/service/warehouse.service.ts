import { GraphClient } from '../lib/graphClient';
import { WarehouseQuery } from '../lib/graphQueries/warehouse.query';
import { Warehouse } from '../models/warehouse';

export class WarehouseService {
    public static async getAll(token: string): Promise<Warehouse[]> {
        const data = await GraphClient.query({
            query: {
                query: WarehouseQuery.warehouses
            }, token
        });

        return data.warehouses.map((e: any) => Warehouse.fromJson(e));
    }

    public static async get(token: string, id: number): Promise<Warehouse> {
        const data = await GraphClient.query({
            query: {
                query: WarehouseQuery.getWarehouse,
                variables: { id }
            }, token
        });

        return Warehouse.fromJson(data.getWarehouse);
    }

    public static async create(token: string, warehouse: Warehouse) {
        await GraphClient.mutation({
            mutation: {
                mutation: WarehouseQuery.createWarehouse,
                variables: {
                    ...warehouse,
                }
            }, token
        });
    }

    public static async edit(token: string, warehouse: Warehouse) {
        await GraphClient.mutation({
            mutation: {
                mutation: WarehouseQuery.editWarehouse,
                variables: {
                    ...warehouse,
                }
            }, token
        });
    }

    public static async delete(token: string, id: number): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: WarehouseQuery.deleteWarehouse,
                variables: { id }
            }, token
        });

        return data ? data.deleteWarehouse : '';
    }

    public static async deleteMany(token: string, ids: number[]): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: WarehouseQuery.deleteWarehouses,
                variables: { ids }
            }, token
        });

        return data ? data.deleteWarehouses : '';
    }
}
