import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service/user.service';

const userController = {
    login: async (req: Request, res: Response, next: NextFunction) => {
        UserService.authenticate(req.body.usernameOrEmail, req.body.password)
            .then(token => {
                return res.status(200).json(token);
            })
            .catch(err => next(err));
    }
};

export { userController as UserController };
