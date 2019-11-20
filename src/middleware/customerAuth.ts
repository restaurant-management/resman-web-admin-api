import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import jwt from 'jsonwebtoken';
import { Customer } from '../entity/customer';

const customerAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: __('authentication.no_token_provided')
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: err.message
            });
        }

        try {
            const customer = await Customer.findOne({
                where: { uuid: decoded['uuid'] },
                relations: ['userRole']
            });

            if (!customer) {
                return res.status(401).json({
                    message: __('authentication.fail_authenticate_token')
                });
            }

            const { password, ...customerWithoutPassword } = customer;

            req['customer'] = customerWithoutPassword;

            return next();
        } catch (e) {
            return res.status(401).json({
                message: err.message
            });
        }
    });
};

export { customerAuth as CustomerAuth };
