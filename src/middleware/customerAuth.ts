import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import jwt from 'jsonwebtoken';
import { Customer } from '../entity/customer';
import { HttpError } from '../lib/httpError';

const customerAuth = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new HttpError(401, __('authentication.no_token_provided'));
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            try {
                if (err) {
                    throw new HttpError(401, err.message);
                }

                try {
                    const customer = await Customer.findOne({
                        where: { uuid: decoded['uuid'] }
                    });

                    if (!customer) {
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
        });
    } catch (e) {
        next(e);
    }
};

export { customerAuth as CustomerAuth };
