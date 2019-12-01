import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { User } from '../entity/user';
import { HttpError } from '../lib/httpError';
import { UserAuth } from './userAuth';

const authorMiddleware = (requiredPermissions: string[]) => {
    return [
        UserAuth,
        (req: Request, _res: Response, next: NextFunction) => {
            const currentUser: User = req['user'];

            authorization(currentUser, requiredPermissions);

            return next();
        }
    ];
};

const authorization = (currentUser: User, requiredPermissions: string[]) => {
    let permissions: string[] = [];

    if (!currentUser || !currentUser.roles || currentUser.roles.length === 0) {
        throw new HttpError(401, __('authentication.unauthorized'));
    }

    currentUser.roles.forEach(role => {
        permissions = permissions.concat(role.permissions);
    });

    for (const permission of requiredPermissions) {
        if (!permissions.find(p => permission === p)) {
            throw new HttpError(401, __('authentication.unauthorized'));
        }
    }
};

const authorizationOr = (requiredPermissions: string[]) => {
    return [
        UserAuth,
        (req: Request, _res: Response, next: NextFunction) => {
            const currentUser: User = req['user'];
            let permissions: string[] = [];

            if (!currentUser.roles) {
                throw new HttpError(401, __('authentication.unauthorized'));
            }

            currentUser.roles.forEach(role => {
                permissions = permissions.concat(role.permissions);
            });

            for (const permission of requiredPermissions) {
                if (permissions.find(p => permission === p)) {
                    return next();
                }
            }

            throw new HttpError(401, __('authentication.unauthorized'));
        }
    ];
};

export { authorMiddleware as AuthorMiddleware, authorizationOr as AuthorizationOr, authorization as Authorization };
