import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { DiscountCodeService } from '../service/discountCode.service';

class DiscountCodeController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        DiscountCodeService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        DiscountCodeService.create(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        DiscountCodeService.getOne(req.params.id, req.query).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        DiscountCodeService.edit(req.params.id, req.body).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        DiscountCodeService.delete(req.params.id).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const discountCodeController = new DiscountCodeController();

export { discountCodeController as DiscountCodeController };
