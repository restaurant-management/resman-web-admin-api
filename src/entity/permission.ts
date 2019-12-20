class PermissionByModule {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get list(): string {
        return this._name + '.list';
    }

    get create(): string {
        return this._name + '.create';
    }

    get update(): string {
        return this._name + '.update';
    }

    get delete(): string {
        return this._name + '.delete';
    }

    get import(): string {
        return this._name + '.import';
    }

    get export(): string {
        return this._name + '.export';
    }

    public toArray() {
        return [this.list, this.create, this.update, this.delete, this.import, this.export];
    }
}

const permission = {
    user: new PermissionByModule('user'),
    role: new PermissionByModule('role'),
    customer: new PermissionByModule('customer'),
    store: new PermissionByModule('store'),
    warehouse: new PermissionByModule('warehouse'),
    discountCode: new PermissionByModule('discountCode'),
    voucherCode: new PermissionByModule('voucherCode'),
    discountCampaign: new PermissionByModule('discountCampaign'),
    dish: new PermissionByModule('dish'),
    dailyDish: new PermissionByModule('dailyDish'),
    bill: new PermissionByModule('bill'),
    deliveryBill: new PermissionByModule('deliveryBill'),
    analysis: new PermissionByModule('analysis'),
    stock: new PermissionByModule('stock'),
    importBill: new PermissionByModule('importBill'),
    dailyReport: new PermissionByModule('dailyReport'),
    comment: new PermissionByModule('comment'),
    toArray: (): string[] => {
        let array = [];
        Object.keys(permission).forEach(key => {
            if (permission[key].toArray) {
                array = [...array, ...permission[key].toArray()];
            }
        });

        return array;
    }
};

export { permission as Permission };
