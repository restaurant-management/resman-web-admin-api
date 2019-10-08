import { NextFunction, Request, Response } from 'express';
import { CustomerService } from '../service/customer.service';

const customerController = {
    login: async (req: Request, res: Response, next: NextFunction) => {
        CustomerService.authenticate(req.body.usernameOrEmail, req.body.password)
            .then(token => {
                return res.status(200).json(token);
            })
            .catch(err => next(err));
    }
};

export { customerController as CustomerController };

