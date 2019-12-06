import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { User } from '../entity/user';
import { HttpError } from '../lib/httpError';
import { AuthService } from '../service/authService';

const userAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new HttpError(401, __('authentication.no_token_provided'));
        }

        try {
            const user = await AuthService.verify(token);
            if (!(user instanceof User)) {
                throw new Error(__('authentication.fail_authenticate_token'));
            }

            const { password, ...userWithoutPassword } = user;

            req['user'] = userWithoutPassword;

            return next();
        } catch (e) {
            throw new HttpError(401, e.message);
        }
    } catch (e) {
        next(e);
    }
};

export { userAuth as UserAuth };
