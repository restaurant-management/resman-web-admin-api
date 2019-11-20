import { NextFunction, Request, Response } from 'express';

export interface ICrudController {
    list(req: Request, res: Response, next: NextFunction);
    create(req: Request, res: Response, next: NextFunction);
    read(req: Request, res: Response, next: NextFunction);
    update(req: Request, res: Response, next: NextFunction);
    delete(req: Request, res: Response, next: NextFunction);
}
