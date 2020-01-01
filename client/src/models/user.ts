export class User {

    public static fromJson(jsonObject: any) {
        const user: User = {
            ...jsonObject,
            roles: jsonObject.roles ? jsonObject.roles.map((e: any) => e.slug) : [],
            roleNames: jsonObject.roles ? jsonObject.roles.map((e: any) => e.name) : [],
            storeIds: jsonObject.stores ? jsonObject.stores.map((e: any) => parseInt(e.id, 10)) : []
        };

        return user;
    }

    public readonly uuid?: string = '';
    public readonly fullName?: string = '';
    public avatar?: string = '';
    public readonly avatarFile?: File;
    public readonly username: string = '';
    public readonly password?: string = '';
    public readonly email: string = '';
    public readonly phoneNumber: string = '';
    public readonly roles?: string[] = [];
    public readonly roleNames?: string[] = [];
    public readonly birthday?: Date;
    public readonly address: string = '';
    public readonly storeIds: number[] = [];
}
