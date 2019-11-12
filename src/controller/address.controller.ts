import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { AddressService } from '../service/address.service';

class AddressController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        AddressService.getAll(req.query).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        AddressService.create(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        AddressService.getOne(parseInt(req.params.id, 10)).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        AddressService.edit(parseInt(req.params.id, 10), req.body).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        AddressService.delete(parseInt(req.params.id, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const addressController = new AddressController();

export { addressController as AddressController };
