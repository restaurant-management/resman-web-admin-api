import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/user';
import { UserAuth } from './userAuth';

class Authorization {
    private _permissions: string[];

    constructor(permissions: string[]) {
        this._permissions = permissions;
    }

    public handle(req: Request, res: Response, next: NextFunction) {
        if (!req['user']) {
            UserAuth(req, res, next);
        }

        const currentUser: User = req['user'];
        const permissions: string[] = [];

        currentUser.roles.forEach(role => {
            permissions.concat(role.permissions);
        });

        this._permissions.forEach(permission => {
            if (!permissions.find(p => permission === p)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        });

        next();
    }
}
