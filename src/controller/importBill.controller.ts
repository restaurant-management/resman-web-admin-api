import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { ImportBillService } from '../service/importBill.service';

class ImportBillController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        ImportBillService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        ImportBillService.create(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        ImportBillService.getOne(parseInt(req.params.id, 10)).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        ImportBillService.edit(parseInt(req.params.id, 10), { note: req.body.note })
            .then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        ImportBillService.delete(parseInt(req.params.id, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const importBillController = new ImportBillController();

export { importBillController as ImportBillController };
