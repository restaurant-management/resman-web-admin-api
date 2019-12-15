import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { AuthChecker } from 'type-graphql';
import { User } from '../entity/user';
import { GraphUserContext } from '../lib/graphContext';
import { HttpError } from '../lib/httpError';
import { UserAuth } from './userAuth';

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

const authorRoleGraphMiddleware: AuthChecker<GraphUserContext> = ({ context }, roles) => {
    return _authorizationByRole(context.payload.user, roles, true, 'normal');
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

export {
    authorizationByRole as AuthorizationByRole,
    authorRoleGraphMiddleware as AuthorRoleGraphMiddleware
};
