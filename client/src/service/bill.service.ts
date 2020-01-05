import { GraphClient } from '../lib/graphClient';
import { BillQuery } from '../lib/graphQueries/bill.query';
import { Bill } from '../models/bill';

export class BillService {
    public static async getAll(token: string, storeId?: number, startDay?: Date, endDay?: Date): Promise<Bill[]> {
        const data = await GraphClient.query({
            query: {
                query: BillQuery.bills,
                variables: { storeId, startDay, endDay }
            }, token
        });

        return data.bills.map((e: any) => Bill.fromJson(e));
    }

    public static async get(token: string, id: number): Promise<Bill> {
        const data = await GraphClient.query({
            query: {
                query: BillQuery.getBill,
                variables: { id }
            }, token
        });

        return Bill.fromJson(data.getBill);
    }

    public static async create(token: string, bill: Bill) {
        try {
            const variables = {
                ...bill,
                dishIds: bill.dishes ? bill.dishes.map(e => e.dishId) : undefined,
                dishQuantities: bill.dishes ? bill.dishes.map(e => e.quantity) : undefined,
                createByUuid: bill.createBy ? bill.createBy.uuid : undefined,
                prepareByUuid: bill.prepareBy ? bill.prepareBy.uuid : undefined,
                collectByUuid: bill.collectBy ? bill.collectBy.uuid : undefined
            };
            await GraphClient.mutation({ mutation: { mutation: BillQuery.createBillByAdmin, variables }, token });
        } catch (e) {
            throw e;
        }
    }

    public static async edit(token: string, bill: Bill) {
        await GraphClient.mutation({
            mutation: {
                mutation: BillQuery.editBill,
                variables: {
                    ...bill,
                    dishIds: bill.dishes ? bill.dishes.map(e => e.dishId) : undefined,
                    dishQuantities: bill.dishes ? bill.dishes.map(e => e.quantity) : undefined,
                    createByUuid: bill.createBy ? bill.createBy.uuid : undefined,
                    prepareByUuid: bill.prepareBy ? bill.prepareBy.uuid : undefined,
                    collectByUuid: bill.collectBy ? bill.collectBy.uuid : undefined
                }
            }, token
        });
    }

    public static async delete(token: string, id: number): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: BillQuery.deleteBill,
                variables: { id }
            }, token
        });

        return data ? data.deleteBill : '';
    }
}
