import moment from 'moment';
import { Dish } from './dish';

export class Store {

    public static fromJson(jsonObject: any) {
        let store: Store;
        store = {
            ...jsonObject,
            id: parseInt(jsonObject.id, 10),
            openTime: jsonObject.openTime ? moment(jsonObject.openTime, 'HH:mm:ss') : undefined,
            closeTime: jsonObject.closeTime ? moment(jsonObject.closeTime, 'HH:mm:ss') : undefined,
            storeDishes: jsonObject.storeDishes
        };

        return store;
    }

    public id?: number = 0;
    public name: string = '';
    public amountDishes?: number = 0;
    public address: string = '';
    public closeTime?: Date;
    public openTime?: Date;
    public hotline: string = '';
    public logo?: string;
    public logoFile?: File;
    public storeDishes?: Array<{
        dishId?: number;
        dish?: Dish;
        price?: number;
    }>;
}
