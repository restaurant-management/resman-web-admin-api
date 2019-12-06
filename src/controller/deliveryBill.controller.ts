import { NextFunction, Request, Response } from 'express';
import { Customer } from '../entity/customer';
import { User } from '../entity/user';
import { ICrudController } from '../lib/ICrudController';
import { AuthorizationStore } from '../middleware/authorization';
import { DeliveryBillService } from '../service/deliveryBill.service';

class DeliveryBillController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        DeliveryBillService.getAll(req.query).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        try {
            AuthorizationStore(req['user'], req.body.storeId);
            DeliveryBillService.create(req.body)
                .then(value => {
                    return res.status(200).json(value);
                }).catch(e => next(e));
        } catch (e) {
            next(e);
        }
    }

    public createWithRestrict(req: Request, res: Response, next: NextFunction): void {
        const customer: Customer = req['customer'];
        req.body.customerUuid = customer.uuid;

        DeliveryBillService.createWithRestrict(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        DeliveryBillService.getOne(parseInt(req.params.id, 10), req.query).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        DeliveryBillService.edit(parseInt(req.params.id, 10), req['user'], req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public rating(req: Request, res: Response, next: NextFunction): void {
        const customer: Customer = req['customer'];
        req.body.customerUuid = customer.uuid;
        DeliveryBillService.rateDeliveryBill(parseInt(req.params.id, 10), req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        DeliveryBillService.delete(parseInt(req.params.id, 10), req['user']).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }

    public prepare(req: Request, res: Response, next: NextFunction): void {
        DeliveryBillService.prepareDeliveryBill(parseInt(req.params.id, 10), req['user']).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public prepared(req: Request, res: Response, next: NextFunction): void {
        DeliveryBillService.preparedDeliveryBill(parseInt(req.params.id, 10), req['user']).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public ship(req: Request, res: Response, next: NextFunction): void {
        DeliveryBillService.shipDeliveryBill(parseInt(req.params.id, 10), req['user']).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public collect(req: Request, res: Response, next: NextFunction): void {
        const user: User = req['user'];
        req.body.collectByUuid = user.uuid;
        DeliveryBillService.collectDeliveryBill(parseInt(req.params.id, 10), req['user'], req.body).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }
}

const deliveryBillController = new DeliveryBillController();

export { deliveryBillController as DeliveryBillController };
