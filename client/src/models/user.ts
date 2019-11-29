export class User {

    public static fromJson(jsonObject: any) {
        // TODO implement this function
        return jsonObject;
    }

    public readonly name?: string;
    public readonly avatar?: string;
    public readonly username: string;
    public readonly email: string;
    public readonly phoneNumber: string;
    public readonly roles: string[];
    public readonly birthday?: Date;
    public readonly address: string;

    private constructor() {
        this.name = '';
        this.avatar = '';
        this.username = '';
        this.email = '';
        this.phoneNumber = '';
        this.roles = [];
        this.birthday = new Date();
        this.address = '';
    }
}
