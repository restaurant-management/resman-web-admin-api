import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { MiddlewareFn } from 'type-graphql';
import { Customer } from '../entity/customer';
import { GraphCustomerContext } from '../lib/graphContext';
import { HttpError } from '../lib/httpError';
import { AuthService } from '../service/authService';

const customerAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        req['customer'] = await _customerAuth(token);
    } catch (e) {
        next(e);
    }
};

const customerAuthGraph: MiddlewareFn<GraphCustomerContext> = async ({ context }, next) => {

    context.payload = { customer: await _customerAuth(context.req.headers.authorization) };

    return next();
};

const _customerAuth = async (token: string): Promise<Customer> => {
    if (!token) {
        throw new HttpError(401, __('authentication.no_token_provided'));
    }

    try {
        const customer = await AuthService.verify(token);

        if (!(customer instanceof Customer)) {
            throw new Error(__('authentication.fail_authenticate_token'));
        }

        return customer;

    } catch (e) {
        throw new HttpError(401, e.message);
    }
};

export { customerAuth as CustomerAuth, customerAuthGraph as CustomerAuthGraph };
