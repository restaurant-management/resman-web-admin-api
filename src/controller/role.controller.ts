import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { RoleService } from '../service/role.service';

class RoleController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        RoleService.getAll(req.query).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        RoleService.create(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        RoleService.getOne({ slug: req.params.id }).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        RoleService.edit(req.params.id, req.body).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        RoleService.delete({ slug: req.params.id }).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const roleController = new RoleController();

export { roleController as RoleController };
