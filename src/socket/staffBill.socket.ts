import moment from 'moment';
import Socket from 'socket.io';
import { Between } from 'typeorm';
import { User } from '../entity/user';
import { onlyDate } from '../helper/onlyDate';
import { BillService } from '../service/bill.service';

export enum StaffBillSocketEvent {
    FIRST_CONNECT = 'first_connect',
    // When chef check prepared a bill dish, notify to staff to delivery it
    AMOUNT_PREPARED_BILL_DISH_CHANGE = 'amount_prepared_bill_dish_change',
}

export class StaffSocketBill {
    public readonly billId: number;
    public readonly tableNumber: number;
    public readonly amountPreparedDishes: number;
    public readonly status: 'no-prepare' | 'preparing' | 'prepared';
}

export const staffBillSocket = async (socket: Socket.Socket) => {
    const user: User = socket['user'];

    // Join room to socket notify exactly
    socket.join(user.uuid);

    const bills = await BillService.getAll(user, {
        where: {
            createAt: Between(onlyDate(new Date()), onlyDate(moment(new Date()).add(1, 'day').toDate())),
            collectBy: null,
        }
    });

    const staffBills: StaffSocketBill[] = bills.map(i => i.toStaffSocketBill());

    socket.emit('first_connect', staffBills);
};
