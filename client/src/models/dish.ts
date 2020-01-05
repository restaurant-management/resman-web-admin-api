import { UploadFile } from 'antd/lib/upload/interface';

export class Dish {

    public static fromJson(jsonObject: any) {
        let store: Dish;
        store = {
            ...jsonObject,
            id: parseInt(jsonObject.id, 10)
        };

        return store;
    }

    public id?: number = 0;
    public name: string = '';
    public description?: string;
    public images?: string[];
    public uploadImages?: UploadFile[];
    public defaultPrice?: number;
    public price?: number;
}
