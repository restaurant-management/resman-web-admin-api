import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { Socket } from 'socket.io';
import { User } from '../entity/user';
import { HttpError } from '../lib/httpError';
import { UserAuth, UserAuthGraph } from './userAuth';

const authorizationByRole = (roleSlugs: string[]) => {
    return [
        UserAuth,
        (req: Request, _res: Response, next: NextFunction) => {
            const currentUser: User = req['user'];

            _authorizationByRole(currentUser, roleSlugs);

            return next();
        }
    ];
};

const authorRoleSocketMW = (roleSlugs: string[]) => {
    return async (socket: Socket, next: (err?: any) => void) => {
        const currentUser: User = socket['user'];
        try {
            _authorizationByRole(currentUser, roleSlugs, true, 'normal');

            return next();
        } catch (e) {
            return next(e);
        }
    };
};

const authorRoleGraphMiddleware = (roleSlugs: string[]) => {
    return [
        UserAuthGraph,
        async ({ context }, next) => {

            _authorizationByRole(context.payload.user, roleSlugs, true, 'normal');

            return next();
        }
    ];
};

const _authorizationByRole = (currentUser: User, requiredRoles: string[], throwError: boolean = true,
    errorType: 'normal' | 'http' = 'http') => {

    if (!currentUser.roles) {
        if (throwError) {
            if (errorType === 'http') {
                throw new HttpError(401, __('authentication.unauthorized'));
            } else {
                throw new Error(__('authentication.unauthorized'));
            }
        }

        return false;
    }

    for (const role of requiredRoles) {
        if (currentUser.roles.findIndex(it => it.slug === role) < 0) {
            if (throwError) {
                if (errorType === 'http') {
                    throw new HttpError(401, __('authentication.unauthorized'));
                } else {
                    throw new Error(__('authentication.unauthorized'));
                }
            }

            return false;
        }
    }

    return true;
};

export { authorizationByRole as AuthorizationByRole, authorRoleGraphMiddleware as AuthorRoleGraphMiddleware, authorRoleSocketMW as AuthorRoleSocketMW };
