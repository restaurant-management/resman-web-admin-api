import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { User } from '../entity/user';
import { UserAuth } from './userAuth';

const authorization = (requiredPermissions: string[]) => {
    return [
        UserAuth,
        (req: Request, res: Response, next: NextFunction) => {
            const currentUser: User = req['user'];
            let permissions: string[] = [];

            if (!currentUser.roles) {
                return res.status(401).json({ message: __('authentication.unauthorized') });
            }

            currentUser.roles.forEach(role => {
                permissions = permissions.concat(role.permissions);
            });

            for (const permission of requiredPermissions) {
                if (!permissions.find(p => permission === p)) {
                    return res.status(401).json({ message: __('authentication.unauthorized') });
                }
            }

            return next();
        }
    ];
};

const authorizationOr = (requiredPermissions: string[]) => {
    return [
        UserAuth,
        (req: Request, res: Response, next: NextFunction) => {
            const currentUser: User = req['user'];
            let permissions: string[] = [];

            if (!currentUser.roles) {
                return res.status(401).json({ message: __('authentication.unauthorized') });
            }

            currentUser.roles.forEach(role => {
                permissions = permissions.concat(role.permissions);
            });

            for (const permission of requiredPermissions) {
                if (permissions.find(p => permission === p)) {
                    return next();
                }
            }

            return res.status(401).json({ message: __('authentication.unauthorized') });
        }
    ];
};

export { authorization as Authorization, authorizationOr as AuthorizationOr };
