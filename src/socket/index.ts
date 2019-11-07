import { Server } from 'http';
import { __ } from 'i18n';
import Socket from 'socket.io';
import { User } from '../entity/user';
import { SocketUserAuth } from '../middleware/socketAuth';

export const createSocket = (app: Server) => {
    const io = Socket(app);

    io.of('/user-chat').use(SocketUserAuth).on('connection', (socket) => {
        const user: User = socket['user'];
        const { fullName, username } = user;
        const name = fullName || username;

        if (!user) { socket.disconnect(true); }

        console.log(__('socket.{{name}}_connected', { name }));
        socket.broadcast.emit('new_user', __('socket.{{name}}_connected', { name }));

        socket.on('global_message', (msg) => {
            socket.broadcast.emit('new_message', {
                username,
                fullName,
                message: msg
            });
        });

        socket.on('disconnect', () => {
            console.log(__('socket.{{name}}_disconnected', { name }));
            socket.broadcast.emit('disconnect_user',
                __('socket.{{name}}_disconnected', { name }));
        });
    });
};
