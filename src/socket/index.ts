import { Server } from 'http';
import { __ } from 'i18n';
import Socket from 'socket.io';
import { AuthorRoleSocketMW } from '../middleware/authorizationByRole';
import { SocketUserAuth } from '../middleware/userAuth';
import { chefBillSocket } from './chefBill.socket';
import { SocketRoute } from './socket.route';
import { ChatMessage } from './userChat/chatMessage';
import { ChatUser } from './userChat/chatUser';
import { UserChatRepository } from './userChat/repository';

export let socketServer: Socket.Server;

export const createSocket = (app: Server) => {
    socketServer = Socket(app);
    const repository = UserChatRepository;

    socketServer.of('/user-chat').use(SocketUserAuth).on('connection', (socket) => {
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

    socketServer.of(SocketRoute.chefBill).use(SocketUserAuth)
        .use(AuthorRoleSocketMW(['chef'])).on('connection', chefBillSocket);
};
