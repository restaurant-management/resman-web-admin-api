import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { User } from '../entity/user';
import { UserAuth } from './userAuth';

const authorizationByRole = (roleSlugs: string[]) => {
    return [
        UserAuth,
        (req: Request, res: Response, next: NextFunction) => {
            const currentUser: User = req['user'];

            if (!currentUser.roles) {
                return res.status(401).json({ message: __('authentication.unauthorized') });
            }

            for (const role of roleSlugs) {
                if (currentUser.roles.findIndex(it => it.slug === role) < 0) {
                    return res.status(401).json({ message: __('authentication.unauthorized') });
                }
            }

            return next();
        }
    ];
};

export { authorizationByRole as AuthorizationByRole };
