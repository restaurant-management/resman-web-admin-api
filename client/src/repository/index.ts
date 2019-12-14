import { Config } from '../config';
import { User } from '../models/user';
import { getAllUsers, login } from '../service';

enum StorageKey {
    AUTH_TOKEN = 'auth_token',
    AUTH_AT = 'auth_at'
}

class Repository {

    public get isAuth(): boolean { return this._isAuth; }
    public get isRemember(): boolean { return this._isRemember; }
    private _currentUser: User | undefined;

    private _isAuth: boolean;
    private _isRemember: boolean;

    constructor() {
        const authAtString = localStorage.getItem(StorageKey.AUTH_AT);

        this._isAuth = !!this._getToken();
        this._isRemember = this._isAuth ? !!authAtString : false;

        if (authAtString) {
            if ((new Date().getTime() - new Date(authAtString).getTime()) > Config.rememberPWTime) {
                this.logout();
            }
        }
    }

    public async login(usernameOrEmail: string, password: string, remember: boolean = false) {
        const token = await login(usernameOrEmail, password);

        localStorage.setItem(StorageKey.AUTH_TOKEN, token);
        if (remember) {
            localStorage.setItem(StorageKey.AUTH_AT, new Date().toJSON());
            this._isRemember = true;
        }

        this._isAuth = true;
    }

    public async logout() {
        this._isAuth = false;
        localStorage.removeItem(StorageKey.AUTH_TOKEN);
        localStorage.removeItem(StorageKey.AUTH_AT);
    }

    public async getAllUser() {
        const token = this._getToken();

        return await getAllUsers(token || '');
    }

    private _getToken() {
        return localStorage.getItem(StorageKey.AUTH_TOKEN);
    }
}

const repository = new Repository();

export { repository as Repository };
