import { Dish } from './dish';

export class DailyDish {

    public static fromJson(jsonObject: any) {
        let dailyDish: DailyDish;
        dailyDish = {
            ...jsonObject,
            dishName: jsonObject.dish ? jsonObject.dish.name : '',
            dishPrice: jsonObject.dish && jsonObject.dish.price ? jsonObject.dish.price : jsonObject.dish.defaultPrice
        };

        return dailyDish;
    }

    public day: Date = new Date();
    public dishId: number = -1;
    public dishName?: string;
    public dishPrice?: number;
    public storeId?: number = -1;
    public confirmAt?: Date;
}
