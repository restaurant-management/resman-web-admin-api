import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { Permission } from '../entity/permission';
import { User } from '../entity/user';
import { HttpError } from '../lib/httpError';
import { ICrudController } from '../lib/ICrudController';
import { Authorization } from '../middleware/authorization';
import { UserService } from '../service/user.service';

class UserController implements ICrudController {
    public async login(req: Request, res: Response, next: NextFunction) {
        UserService.authenticate(req.body.usernameOrEmail, req.body.password)
            .then(token => {
                return res.status(200).json(token);
            })
            .catch(err => next(err));
    }

    public async list(req: Request, res: Response, next: NextFunction) {
        UserService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value.map((item => {
                const { password, id, ...exportedData } = item;

                return exportedData;
            })));
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        if (!UserService.checkRoleLevel((req['user'] as User).id, req.body.roles)) {
            return next(new Error(__('user.can_not_create_user_with_higher_level')));
        }

        UserService.create(req.body).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public read(_req: Request, _res: Response, next: NextFunction): void {
        next();
    }

    public getByUsername(req: Request, res: Response, next: NextFunction) {
        if ((req['user'] as User).username !== req.params.username) {
            try {
                Authorization(req['user'], [Permission.user.list]);
            } catch (e) {
                return next(e);
            }
        }

        UserService.getOne({ username: req.params.username }, req.query).then(value => {
            const { password, id, ...exportedData } = value;

            return res.status(200).json(exportedData);
        }).catch(err => next(err));
    }

    public getByEmail(req: Request, res: Response, next: NextFunction) {
        if ((req['user'] as User).email !== req.params.email) {
            try {
                Authorization(req['user'], [Permission.user.list]);
            } catch (e) {
                return next(e);
            }
        }

        UserService.getOne({ email: req.params.email }, req.query).then(value => {
            const { password, id, ...exportedData } = value;

            return res.status(200).json(exportedData);
        }).catch(err => next(err));
    }

    // For user change password.
    public changePassword(req: Request, res: Response, next: NextFunction) {
        UserService.changePassword((req['user'] as User).username, req['user'], req.body.password).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        // Params.id is username
        if (req.params.id !== req['user'].username && !Authorization(req['user'], [Permission.user.update], false)) {
            return next(new HttpError(401, __('authentication.unauthorized')));
        }

        UserService.edit(req.params.id, req['user'], req.body).then(value =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        if (!UserService.checkRoleLevel((req['user'] as User).id, req.body.roles)) {
            return next(new Error(__('user.can_not_delete_user_with_higher_level')));
        }

        UserService.delete(req.params.id).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const userController = new UserController();

export { userController as UserController };
