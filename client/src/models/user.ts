export class User {

    public static fromJson(jsonObject: any) {
        const user = new User();
        user._name = jsonObject.name;
        user._avatar = jsonObject.avatar;

        return user;
    }

    public get name(): string {
        return this._name;
    }

    public get avatar(): string {
        return this._avatar;
    }

    private _name: string;
    private _avatar: string;

    private constructor() {
        this._name = '';
        this._avatar = '';
    }
}
