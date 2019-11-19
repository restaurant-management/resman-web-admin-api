import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { VoucherCodeService } from '../service/voucherCode.service';

class VoucherCodeController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        VoucherCodeService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        VoucherCodeService.create(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        VoucherCodeService.getOne(req.params.id, req.query).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        VoucherCodeService.edit(req.params.id, req.body).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        VoucherCodeService.delete(req.params.id).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const voucherCodeController = new VoucherCodeController();

export { voucherCodeController as VoucherCodeController };
