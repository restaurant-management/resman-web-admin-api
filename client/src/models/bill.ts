export class Bill {

    public static fromJson(jsonObject: any) {
        let bill: Bill;
        bill = {
            ...jsonObject,
            id: parseInt(jsonObject.id, 10),
            tableNumber: parseInt(jsonObject.tableNumber, 10),
            dishes: jsonObject.dishes ? jsonObject.dishes.map((e: any) => (
                {
                    ...e,
                    dishId: parseInt(e.dishId, 10),
                }
            )) : undefined
        };

        return bill;
    }

    public storeId?: number = 0;
    public id?: number = 0;
    public tableNumber: number = 0;
    public createAt?: Date = new Date();
    public prepareAt?: Date;
    public collectAt?: Date;
    public collectValue?: number;
    public voucherCode?: number;
    public voucherValue?: number;
    public voucherIsPercent?: boolean;
    public discountCode?: number;
    public discountValue?: number;
    public rating?: number;
    public note?: string;
    public createBy?: {
        uuid: string;
        username?: string;
    };
    public prepareBy?: {
        uuid: string;
        username?: string;
    };
    public collectBy?: {
        uuid: string;
        username?: string;
    };
    public customer?: {
        uuid: string;
        username?: string;
    };
    public dishes?: Array<{
        price?: number;
        quantity?: number;
        note?: string;
        dishId?: number;
    }>;
}
