import { Address } from './address';

export class Customer {

    public static fromJson(jsonObject: any) {
        const customer: Customer = {
            ...jsonObject,
            addresses: jsonObject.addresses ? jsonObject.addresses.map((e: any) => Address.fromJson(e)) : []
        };

        return customer;
    }

    public readonly uuid?: string = '';
    public readonly fullName?: string = '';
    public avatar?: string = '';
    public readonly avatarFile?: File;
    public readonly username: string = '';
    public readonly password?: string = '';
    public readonly email: string = '';
    public readonly phoneNumber: string = '';
    public readonly birthday?: Date;
    public addresses?: Address[];
}
