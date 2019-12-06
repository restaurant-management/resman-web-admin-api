import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { Customer } from '../entity/customer';
import { HttpError } from '../lib/httpError';
import { AuthService } from '../service/authService';

const customerAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new HttpError(401, __('authentication.no_token_provided'));
        }

        try {
            const customer = await AuthService.verify(token);
            if (!(customer instanceof Customer)) {
                throw new Error(__('authentication.fail_authenticate_token'));
            }

            const { password, ...customerWithoutPassword } = customer;

            req['customer'] = customerWithoutPassword;

            return next();
        } catch (e) {
            throw new HttpError(401, e.message);
        }
    } catch (e) {
        next(e);
    }
};

export { customerAuth as CustomerAuth };
