import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { StockService } from '../service/stock.service';

class StockController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        StockService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        StockService.create(req.body.name, req.body.price, req.body.unit)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        StockService.getOne(parseInt(req.params.id, 10)).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        StockService.edit(parseInt(req.params.id, 10), req.body.name, req.body.price, req.body.unit).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        StockService.delete(parseInt(req.params.id, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const stockController = new StockController();

export { stockController as StockController };
