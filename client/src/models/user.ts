export class User {

    public static fromJson(jsonObject: any) {
        const user: User = { ...jsonObject, roles: jsonObject.roles ? jsonObject.roles.map((e: any) => e.name) : [] };

        return user;
    }

    public readonly uuid: string;
    public readonly fullName?: string;
    public readonly avatar?: string;
    public readonly username: string;
    public readonly email: string;
    public readonly phoneNumber: string;
    public readonly roles: string[];
    public readonly birthday?: Date;
    public readonly address: string;

    private constructor() {
        this.uuid = '';
        this.fullName = '';
        this.avatar = '';
        this.username = '';
        this.email = '';
        this.phoneNumber = '';
        this.roles = [];
        this.birthday = new Date();
        this.address = '';
    }
}
