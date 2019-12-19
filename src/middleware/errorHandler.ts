import { NextFunction, Request, Response } from 'express';
import { MiddlewareFn } from 'type-graphql';
import { HttpError } from '../lib/httpError';

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.log(err);
    }

    if (err instanceof HttpError) {
        return res.status(err.code).json(err.message ? { message: err.message } : null);
    }

    if (typeof (err) === 'string') {
        return res.status(400).json({ message: err });
    }

    return res.status(500).json({ message: err.message });
};

export const graphErrorHandler: MiddlewareFn<any> = async (_, next) => {
    try {
        return await next();
    } catch (err) {

        if (err instanceof HttpError) {
            throw new Error(err.message);
        }

        throw err;
    }
};

export default errorHandler;
