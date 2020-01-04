import { GraphClient } from '../lib/graphClient';
import { DailyDishQuery } from '../lib/graphQueries/dailyDish.query';
import { DailyDish } from '../models/dailyDish';

export class DailyDishService {
    public static async getAll(token: string, day: Date, storeId: number): Promise<DailyDish[]> {
        const data = await GraphClient.query({
            query: {
                query: DailyDishQuery.dailyDishes,
                variables: { day, storeId }
            }, token
        });

        return data.dailyDishes.map((e: any) => DailyDish.fromJson(e));
    }

    public static async create(token: string, storeId: number, day: Date, dishIds: number[]) {
        await GraphClient.mutation({
            mutation: {
                mutation: DailyDishQuery.addDailyDish,
                variables: { day, dishIds, storeId }
            }, token
        });

    }

    public static async confirm(token: string, day: Date, dishId: number, storeId: number): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: DailyDishQuery.confirmDailyDishForAdmin,
                variables: { day, dishId, storeId }
            }, token
        });

        return data ? data.confirmDailyDishForAdmin : '';
    }

    public static async delete(token: string, day: Date, dishId: number, storeId: number): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: DailyDishQuery.removeDailyDish,
                variables: { day, dishId, storeId }
            }, token
        });

        return data ? data.removeDailyDish : '';
    }

    public static async deleteMany(token: string, day: Date, dishIds: number[], storeId: number): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: DailyDishQuery.removeDailyDishes,
                variables: { day, dishIds, storeId }
            }, token
        });

        return data ? data.removeDailyDishes : '';
    }
}
