import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { DailyDishService } from '../service/dailyDish.service';

class DailyDishController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        DailyDishService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        DailyDishService.create(req.body.day || new Date(), req.body.dishId, req.body.storeId, req.body.session)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        DailyDishService.getOne(req.query.day, req.query.dishId, req.query.session).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        DailyDishService.edit(req.query.day, req.query.dishId, req.query.session, req.body.storeId,
            req.body.confirmByUsername, req.body.confirmAt).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        DailyDishService.delete(req.query.day, req.query.dishId, req.query.session).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const dailyDishController = new DailyDishController();

export { dailyDishController as DailyDishController };