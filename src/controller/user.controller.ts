import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { User } from '../entity/user';
import { ICrudController } from '../lib/ICrudController';
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
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        if (!UserService.checkRoleLevel((req['user'] as User).id, req.body.roles)) {
            return next(new Error(__('user.can_not_create_user_with_higher_level')));
        }

        UserService.create(req.body.username, req.body.email, req.body.password, req.body.phoneNumber, req.body.address,
            req.body.fullName, req.body.avatar, req.body.birthday, req.body.roles).then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        UserService.getOne(parseInt(req.params.id, 10)).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        if (!UserService.checkRoleLevel((req['user'] as User).id, req.body.roles)) {
            return next(new Error(__('user.can_not_update_user_with_higher_level')));
        }

        UserService.edit(parseInt(req.params.id, 10), req.body.password, req.body.phoneNumber, req.body.address,
            req.body.fullName, req.body.avatar, req.body.birthday, req.body.roles).then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        if (!UserService.checkRoleLevel((req['user'] as User).id, req.body.roles)) {
            return next(new Error(__('user.can_not_delete_user_with_higher_level')));
        }

        UserService.delete(parseInt(req.params.id, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const userController = new UserController();

export { userController as UserController };
