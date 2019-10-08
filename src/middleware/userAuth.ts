import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entity/user';

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'No token provided. Please check "authorization" header.' });

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) return next(err);

        try {
            let user = await User.findOne({
                where: { uuid: decoded['uuid'] },
                relations: ['userRole']
            });

            if (!user)
                return res.status(500).json({
                    message: 'Failed to authenticate token.'
                });

            const { password, ...userWithoutPassword } = user;

            req['user'] = userWithoutPassword;
            return next();
        } catch (e) {
            return next(e);
        }
    });
};
