import Socket from 'socket.io';
import { User } from '../entity/user';
import { BillService } from '../service/bill.service';

export enum ChefBillSocketEvent {
    NEW_BILL = 'new_bill'
}

export const chefBillSocket = async (socket: Socket.Socket) => {
    const user: User = socket['user'];
    socket.emit('first_connect', await BillService.getAllByUser(user));
};
