import { Config } from '../config';
import { GraphClient } from '../lib/graphClient';
import { User } from '../models/user';
import { UserService } from '../service';

enum StorageKey {
    AUTH_TOKEN = 'auth_token',
    AUTH_AT = 'auth_at',
    USER = 'current_user'
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

        const local = localStorage.getItem(StorageKey.USER);
        if (local) {
            this._currentUser = User.fromJson(JSON.parse(local));
        }
    }

    public async me(forceReload?: boolean) {
        if (!this._currentUser) {
            const local = localStorage.getItem(StorageKey.USER);
            if (local) {
                this._currentUser = User.fromJson(JSON.parse(local));
            }
        }

        if (forceReload || !this._currentUser) {
            try {
                this._currentUser = await UserService.me(this.token);
                this._saveAuth({ user: this._currentUser });
            } catch (e) {
                this.logout();
                throw e;
            }
        }

        return this._currentUser;
    }

    public author(permissions: string[]) {
        if (this._currentUser && this._currentUser.permissions) {
            for (const permission of permissions) {
                if (this._currentUser.permissions.findIndex(e => e === permission) > -1) {
                    return true;
                }
            }
        }

        return false;
    }

    public async login(usernameOrEmail: string, password: string, remember: boolean = false) {
        const token = await UserService.login(usernameOrEmail, password);
        await this.me(true);

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
        this._removeCache();
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

    private _saveAuth(data: { token?: string, user?: User }) {
        if (data.token) {
            localStorage.setItem(StorageKey.AUTH_AT, new Date().toJSON());
            localStorage.setItem(StorageKey.AUTH_TOKEN, data.token);
        }

        if (data.user) {
            localStorage.setItem(StorageKey.USER, JSON.stringify(data.user));
        }
    }

    private _removeCache() {
        localStorage.removeItem(StorageKey.AUTH_TOKEN);
        localStorage.removeItem(StorageKey.AUTH_AT);
        localStorage.removeItem(StorageKey.USER);
    }
}

const repository = new Repository();

export { repository as Repository };
