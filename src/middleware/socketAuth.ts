import { __ } from 'i18n';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { User } from '../entity/user';

const socketUserAuth = (socket: Socket, next: (err?: any) => void) => {
    const token = socket.request.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return next(err);
            }

            try {
                const user = await User.findOne({
                    where: { uuid: decoded['uuid'] },
                    relations: ['roles']
                });

                if (!user) {
                    return next(new Error(__('authentication.fail_authenticate_token')));
                }

                const { password, ...userWithoutPassword } = user;

                socket['user'] = userWithoutPassword;

                return next();
            } catch (e) {
                return next(e);
            }
        });
    } else {
        next(new Error(__('authentication.no_token_provided')));
    }
};

export { socketUserAuth as SocketUserAuth };
