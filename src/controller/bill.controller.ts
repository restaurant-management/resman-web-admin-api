import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/user';
import { ICrudController } from '../lib/ICrudController';
import { BillService } from '../service/bill.service';

class BillController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        BillService.getAll(req['user'], req.query.length, req.query.page, req.query.orderId, req.query.order)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        const user: User = req['user'];

        if (!req.body.createByUuid) {
            req.body.createByUuid = user.uuid;
        }

        BillService.create(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public createWithRestrict(req: Request, res: Response, next: NextFunction): void {
        const user: User = req['user'];

        if (!req.body.createByUuid) {
            req.body.createByUuid = user.uuid;
        }

        BillService.createWithRestrict(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        BillService.getOne(parseInt(req.params.id, 10), req.query).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        const user: User = req['user'];

        if (!req.body.updateByUuid) {
            req.body.updateByUuid = user.uuid;
        }

        BillService.edit(parseInt(req.params.id, 10), req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public rating(req: Request, res: Response, next: NextFunction): void {
        const user: User = req['user'];

        if (!req.body.updateByUuid) {
            req.body.updateByUuid = user.uuid;
        }

        BillService.edit(parseInt(req.params.id, 10), req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        BillService.delete(parseInt(req.params.id, 10), req['user']).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }

    public prepare(req: Request, res: Response, next: NextFunction): void {
        const user: User = req['user'];
        req.body.prepareByUuid = user.uuid;
        BillService.prepareBill(parseInt(req.params.id, 10), req.body).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public prepared(req: Request, res: Response, next: NextFunction): void {
        BillService.preparedBillDish(parseInt(req.params.id, 10), parseInt(req.params.dishId, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }

    public delivered(req: Request, res: Response, next: NextFunction): void {
        BillService.deliveredBillDish(parseInt(req.params.id, 10), parseInt(req.params.dishId, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }

    public collect(req: Request, res: Response, next: NextFunction): void {
        const user: User = req['user'];
        req.body.collectByUuid = user.uuid;
        BillService.collectBill(parseInt(req.params.id, 10), req.body).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }

    public changeDish(req: Request, res: Response, next: NextFunction): void {
        const user: User = req['user'];
        req.body.updateByUuid = user.uuid;
        BillService.changeDishes(parseInt(req.params.id, 10), req.body).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }

    public assignedCustomer(req: Request, res: Response, next: NextFunction): void {
        BillService.assignCustomer(parseInt(req.params.id, 10), req.body).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const billController = new BillController();

export { billController as BillController };
