import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { DishService } from '../service/dish.service';

class DishController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        DishService.getAll(req.query).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        DishService.create(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        DishService.getOne(parseInt(req.params.id, 10)).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        DishService.edit(parseInt(req.params.id, 10), req.body).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        DishService.delete(parseInt(req.params.id, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const dishController = new DishController();

export { dishController as DishController };
