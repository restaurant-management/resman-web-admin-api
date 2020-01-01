import { GraphClient } from '../lib/graphClient';
import { GraphQuery } from '../lib/graphQuery';
import { Store } from '../models/store';

export class StoreService {
    public static async getAll(): Promise<Store[]>  {
        const data = await GraphClient.query({
            query: {
                query: GraphQuery.stores
            }
        });

        return data.stores.map((e: any) => Store.fromJson(e));
    }
}