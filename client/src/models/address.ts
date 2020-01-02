export class Address {

    public static fromJson(jsonObject: any) {
        const address: Address = {
            ...jsonObject,
            id: parseInt(jsonObject.id, 10)
        };

        return address;
    }

    public id?: number;
    public address: string = '';
    public longitude?: number;
    public latitude?: number;
}
