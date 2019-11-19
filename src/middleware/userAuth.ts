import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import jwt from 'jsonwebtoken';
import { User } from '../entity/user';

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: __('authentication.no_token_provided')
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: err.message
            });
        }

        try {
            const user = await User.findOne({
                where: { uuid: decoded['uuid'] },
                relations: ['roles']
            });

            if (!user) {
                return res.status(401).json({
                    message: __('authentication.fail_authenticate_token')
                });
            }

            const { password, ...userWithoutPassword } = user;

            req['user'] = userWithoutPassword;

            return next();
        } catch (e) {
            return next(e);
        }
    });
};

export { userAuth as UserAuth };
