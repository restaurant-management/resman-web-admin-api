import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import jwt from 'jsonwebtoken';
import { User } from '../entity/user';
import { HttpError } from '../lib/httpError';

const userAuth = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new HttpError(401, __('authentication.no_token_provided'));
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            try {
                if (err) {
                    throw new HttpError(401, err.message);
                }

                try {
                    const user = await User.findOne({
                        where: { uuid: decoded['uuid'] },
                        relations: ['roles']
                    });

                    if (!user) {
                        throw new Error(__('authentication.fail_authenticate_token'));
                    }

                    const { password, ...userWithoutPassword } = user;

                    req['user'] = userWithoutPassword;

                    return next();
                } catch (e) {
                    throw new HttpError(401, e.message);
                }
            } catch (e) {
                next(e);
            }
        });
    } catch (e) {
        next(e);
    }
};

export { userAuth as UserAuth };
