import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { CustomerService } from '../service/customer.service';

class CustomerController implements ICrudController {
    public async login(req: Request, res: Response, next: NextFunction) {
        CustomerService.authenticate(req.body.usernameOrEmail, req.body.password)
            .then(token => {
                return res.status(200).json(token);
            })
            .catch(err => next(err));
    }

    public async list(req: Request, res: Response, next: NextFunction) {
        CustomerService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        CustomerService.create(req.body).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        CustomerService.getOne({ username: req.params.id }).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        CustomerService.edit(req.params.id, req.body).then(value =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        CustomerService.delete(req.params.id).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }

    public editProfile(req: Request, res: Response, next: NextFunction): void {
        CustomerService.editProfile(req.params.id, req['customer'], req.body).then(value =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    // For user change password.
    public changePassword(req: Request, res: Response, next: NextFunction) {
        CustomerService.changePassword(req['customer'], req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }
}

const customerController = new CustomerController();

export { customerController as CustomerController };
