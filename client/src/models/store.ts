export class Store {

    public static fromJson(jsonObject: any) {
        let store: Store;
        store = { ...jsonObject, id: parseInt(jsonObject.id, 10) };

        return store;
    }

    public id: number = 0;
    public name: string = '';
    public amountDishes: number = 0;
    public address: string = '';
    public closeTime?: Date;
    public openTime?: Date;
    public hotline: string = '';
    public logo: string = '';
}
