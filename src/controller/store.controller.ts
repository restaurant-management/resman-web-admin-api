import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { StoreService } from '../service/store.service';

class StoreController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        StoreService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        StoreService.create(req.body.name, req.body.address, req.body.hotline, req.body.description, req.body.logo)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        StoreService.getOne(parseInt(req.params.id, 10)).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        StoreService.edit(parseInt(req.params.id, 10), req.body.name, req.body.address, req.body.hotline,
            req.body.description, req.body.logo).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        StoreService.delete(parseInt(req.params.id, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const storeController = new StoreController();

export { storeController as StoreController };
