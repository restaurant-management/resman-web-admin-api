import { NextFunction, Request, Response } from 'express';
import { __ } from 'i18n';
import { Socket } from 'socket.io';
import { MiddlewareFn } from 'type-graphql';
import { User } from '../entity/user';
import { GraphUserContext } from '../lib/graphContext';
import { HttpError } from '../lib/httpError';
import { AuthService } from '../service/authService';

const userAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        req['user'] = await _userAuth(token);

        return next();
    } catch (e) {
        return next(e);
    }
};

const socketUserAuth = async (socket: Socket, next: (err?: any) => void) => {
    try {
        const token = socket.request.headers.authorization;

        socket['user'] = await _userAuth(token);

        return next();
    } catch (e) {
        return next(e);
    }
};

const userAuthGraph: MiddlewareFn<GraphUserContext> = async ({ context }, next) => {

    context.payload = { user: await _userAuth(context.req.headers.authorization) };

    return next();
};

const _userAuth = async (token: string): Promise<User> => {
    if (!token) {
        throw new HttpError(401, __('authentication.no_token_provided'));
    }

    try {
        const user = await AuthService.verify(token);

        if (!(user instanceof User)) {
            throw new Error(__('authentication.fail_authenticate_token'));
        }

        return user;

    } catch (e) {
        throw new HttpError(401, e.message);
    }
};

export { userAuth as UserAuth, userAuthGraph as UserAuthGraph, socketUserAuth as SocketUserAuth };
