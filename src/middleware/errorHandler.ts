import { NextFunction, Request, Response } from 'express';

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    if (typeof (err) === 'string') {
        return res.status(400).json({ message: err });
    }

    return res.status(500).json({ message: err.message });
};

export default errorHandler;
