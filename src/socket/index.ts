import { Server } from 'http';
import { __ } from 'i18n';
import Socket from 'socket.io';
import { SocketUserAuth } from '../middleware/socketAuth';
import { ChatMessage } from './userChat/chatMessage';
import { ChatUser } from './userChat/chatUser';
import { UserChatRepository } from './userChat/repository';

export const createSocket = (app: Server) => {
    const io = Socket(app);
    const repository = UserChatRepository;

    io.of('/user-chat').use(SocketUserAuth).on('connection', (socket) => {
        const user: ChatUser = ChatUser.fromUser(socket['user']);
        repository.addUser(user);

        if (!user) { socket.disconnect(true); }

        console.log(__('socket.{{name}}_connected', { name: user.name }));
        socket.broadcast.emit('new_user', __('socket.{{name}}_connected', { name: user.name }));

        socket.emit('first_connect', {
            user,
            users: repository.getUsers(),
            messages: repository.getMessages(10)
        });

        socket.on('global_message', (msg) => {
            const message = new ChatMessage(msg, user);
            repository.addMessage(message);

            socket.broadcast.emit('new_message', message);
        });

        socket.on('disconnect', () => {
            repository.removeUser(user);
            console.log(__('socket.{{name}}_disconnected', { name: user.name }));
            socket.broadcast.emit('disconnect_user',
                __('socket.{{name}}_disconnected', { name: user.name }));
        });
    });
};
