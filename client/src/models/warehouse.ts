export class Warehouse {

    public static fromJson(jsonObject: any) {
        let warehouse: Warehouse;
        warehouse = {
            ...jsonObject,
            id: parseInt(jsonObject.id, 10),
            storeId: jsonObject.store && jsonObject.store.id ? parseInt(jsonObject.store.id, 10) : undefined,
            store: jsonObject.store && jsonObject.store.name ? jsonObject.store.name : undefined
        };

        return warehouse;
    }

    public id?: number = 0;
    public name: string = '';
    public address: string = '';
    public description?: string = '';
    public hotline: string = '';
    public storeId?: number;
    public store?: string;
}
