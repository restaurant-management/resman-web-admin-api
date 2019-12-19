import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { ICrudController } from '../lib/ICrudController';
import { DailyDishService } from '../service/dailyDish.service';

class DailyDishController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        DailyDishService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }
    public async listToday(req: Request, res: Response, next: NextFunction) {
        if (!req.query.storeId) { next(new Error(__('daily_dish.no_storeId_is_provided'))); }

        DailyDishService.getBy({ day: new Date(), storeId: req.query.storeId }).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        DailyDishService.create(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        DailyDishService.getOne(req.query).then((value) =>
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
        DailyDishService.delete(req.query).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const dailyDishController = new DailyDishController();

export { dailyDishController as DailyDishController };
