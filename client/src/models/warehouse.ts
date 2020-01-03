import moment from 'moment';

export class Warehouse {

    public static fromJson(jsonObject: any) {
        let warehouse: Warehouse;
        warehouse = {
            ...jsonObject,
            id: parseInt(jsonObject.id, 10),
            storeId: jsonObject.store && jsonObject.store.id ? parseInt(jsonObject.store.id, 10) : -1
        };

        return warehouse;
    }

    public id?: number = 0;
    public name: string = '';
    public address: string = '';
    public description?: string = '';
    public hotline: string = '';
    public storeId: number = -1;
}
