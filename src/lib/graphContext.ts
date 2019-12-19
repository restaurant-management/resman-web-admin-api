import { Request, Response } from 'express';
import { Customer } from '../entity/customer';
import { User } from '../entity/user';

export interface GraphUserContext {
    req: Request;
    res: Response;
    payload: {
        user: User
    };
}

export interface GraphCustomerContext {
    req: Request;
    res: Response;
    payload: {
        customer: Customer
    };
}
