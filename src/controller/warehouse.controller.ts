import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { WarehouseService } from '../service/warehouse.service';

class WarehouseController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        WarehouseService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        WarehouseService.create(req.body.name, req.body.address, req.body.hotline, req.body.description)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        WarehouseService.getOne(parseInt(req.params.id, 10)).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        WarehouseService.edit(parseInt(req.params.id, 10), req.body.name, req.body.address, req.body.hotline,
            req.body.description).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        WarehouseService.delete(parseInt(req.params.id, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const warehouseController = new WarehouseController();

export { warehouseController as WarehouseController };
