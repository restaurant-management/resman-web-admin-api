import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { User } from '../entity/user';
import { HttpError } from '../lib/httpError';
import { UserAuth } from './userAuth';

const authorizationByRole = (roleSlugs: string[]) => {
    return [
        UserAuth,
        (req: Request, _res: Response, next: NextFunction) => {
            const currentUser: User = req['user'];

            if (!currentUser.roles) {
                throw new HttpError(401, __('authentication.unauthorized'));
            }

            for (const role of roleSlugs) {
                if (currentUser.roles.findIndex(it => it.slug === role) < 0) {
                    throw new HttpError(401, __('authentication.unauthorized'));
                }
            }

            return next();
        }
    ];
};

export { authorizationByRole as AuthorizationByRole };

