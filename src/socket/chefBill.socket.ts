import Socket from 'socket.io';
import { User } from '../entity/user';

export enum ChefBillSocketEvent {
    NEW_BILL = 'new_bill', // When staff create bill
    NEW_D_BILL = 'new_d_bill', // When customer create bill
    NEW_PREPARE_BILL = 'new_prepare_bill', // When chef select a bill to prepare
    NEW_PREPARED_BILL = 'new_prepared_bill', // When chef prepared all dish in bill
    NEW_PREPARE_D_BILL = 'new_prepare_d_bill', // When chef select a delivery bill to prepare
    NEW_PREPARED_D_BILL = 'new_prepared_d_bill', // When chef check prepared a delivery bill
}

export const chefBillSocket = async (socket: Socket.Socket) => {
    const user: User = socket['user'];

    // Join room to socket notify exactly
    socket.join(user.uuid);

    socket.emit('first_connect', `Welcome ${user.username}`);
};
