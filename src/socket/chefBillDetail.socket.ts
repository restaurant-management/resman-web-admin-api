import { __ } from 'i18n';
import Socket from 'socket.io';
import { User } from '../entity/user';

export enum ChefBillDetailSocketEvent {
    NEW_DELIVERED_BILL_DISH = 'new_delivered_bill_dish', // When staff check delivery a bill dish
}

export const chefBillDetailSocket = async (socket: Socket.Socket) => {
    const user: User = socket['user'];

    if (!socket.handshake.query.billId) {
        throw new Error(__('socket.error_missing_bill_id'));
    }

    // Join room to socket notify exactly
    socket.join(user.uuid + socket.handshake.query.billId);

    socket.emit('first_connect', `Welcome ${user.username}`);
};
