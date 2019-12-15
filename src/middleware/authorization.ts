import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { AuthChecker } from 'type-graphql';
import { User } from '../entity/user';
import { GraphUserContext } from '../lib/graphContext';
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

const authorGraphMiddleware: AuthChecker<GraphUserContext> = ({ context }, permissions) => {
    return authorization(context.payload.user, permissions, true, 'normal');
};

const authorStoreMiddleware = (substitutePermissions: string[]) => {
    return [
        UserAuth,
        (req: Request, _res: Response, next: NextFunction) => {
            const currentUser: User = req['user'];

            try {
                authorizationStore(currentUser, req.body.storeId);
            } catch (e) {
                try {
                    authorization(currentUser, substitutePermissions);
                } catch (_) {
                    throw e;
                }
            }

            return next();
        }
    ];
};

const authorization = (currentUser: User, requiredPermissions: string[], throwError: boolean = true,
    errorType: 'normal' | 'http' = 'http') => {

    let permissions: string[] = [];

    if (!currentUser || !currentUser.roles || currentUser.roles.length === 0) {
        if (throwError) {
            if (errorType === 'http') {
                throw new HttpError(401, __('authentication.unauthorized'));
            } else {
                throw new Error(__('authentication.unauthorized'));
            }
        }

        return false;
    }

    currentUser.roles.forEach(role => {
        permissions = permissions.concat(role.permissions);
    });

    for (const permission of requiredPermissions) {
        if (!permissions.find(p => permission === p)) {
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

const authorizationStore = (currentUser: User, storeId: number) => {
    if (!storeId) {
        throw new Error(__('error.no_storeId_is_provided'));
    }

    const stores = currentUser?.stores || [];

    if (stores.findIndex(item => item.id === storeId) === -1) {
        throw new HttpError(401, 'authentication.unauthorized_store');
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

export { authorMiddleware as AuthorMiddleware, authorizationOr as AuthorizationOr, authorization as Authorization, authorizationStore as AuthorizationStore, authorStoreMiddleware as AuthorStoreMiddleware, authorGraphMiddleware as AuthorGraphMiddleware };
