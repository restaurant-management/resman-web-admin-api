import { Config } from '../config';
import { GraphClient } from '../lib/graphClient';
import { User } from '../models/user';
import { UserService } from '../service';

enum StorageKey {
    AUTH_TOKEN = 'auth_token',
    AUTH_AT = 'auth_at'
}

class Repository {

    public get isAuth(): boolean {
        return this._isAuth;
    }

    public get isRemember(): boolean {
        return this._isRemember;
    }

    public get token(): string {
        return Repository._getToken() || '';
    }

    public get currentUser(): User | undefined {
        return this._currentUser;
    }

    private static _getToken() {
        return localStorage.getItem(StorageKey.AUTH_TOKEN);
    }

    private _currentUser: User | undefined;

    private _isAuth: boolean;
    private _isRemember: boolean;

    constructor() {
        const authAtString = localStorage.getItem(StorageKey.AUTH_AT);

        this._isAuth = !!Repository._getToken();
        this._isRemember = this._isAuth ? !!authAtString : false;

        if (authAtString) {
            if ((new Date().getTime() - new Date(authAtString).getTime()) > Config.rememberPWTime) {
                this.logout();
            }
        }
    }

    public async me() {
        if (!this._currentUser) {
            try {
                this._currentUser = await UserService.me(this.token);
            } catch (e) {
                console.log(e);
                this.logout();

                return;
            }
        }

        return this._currentUser;
    }

    public author(permissions: string[]) {
        if (this.currentUser && this.currentUser.permissions) {
            for (const permission of permissions) {
                if (this.currentUser.permissions.findIndex(e => e === permission) > -1) {
                    return true;
                }
            }
        }

        return false;
    }

    public async login(usernameOrEmail: string, password: string, remember: boolean = false) {
        const token = await UserService.login(usernameOrEmail, password);
        await this.me();

        localStorage.setItem(StorageKey.AUTH_TOKEN, token);
        if (remember) {
            localStorage.setItem(StorageKey.AUTH_AT, new Date().toJSON());
            this._isRemember = true;
        }

        this._isAuth = true;
    }

    public async logout() {
        this._isAuth = false;
        this._currentUser = undefined;
        localStorage.removeItem(StorageKey.AUTH_TOKEN);
        localStorage.removeItem(StorageKey.AUTH_AT);
    }

    public async getAllUser() {
        const token = Repository._getToken();

        return await UserService.getAllUsers(token || '');
    }

    public getGraphAuthClient() {
        return GraphClient.create(localStorage.getItem(StorageKey.AUTH_TOKEN) || '');
    }

    public async createUser(user: User) {
        await UserService.createUser(this.token, user);
    }
}

const repository = new Repository();

export { repository as Repository };
