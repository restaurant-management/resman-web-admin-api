import { __ } from 'i18n';
import { getConnection } from 'typeorm';
import { Customer } from '../entity/customer';
import { PasswordHandler } from '../helper/passwordHandler';
import { AddressService } from './address.service';
import { AuthService } from './authService';

class CustomerService {
    public async authenticate(usernameOrEmail: string, password: string) {
        let customer = await getConnection()
            .createQueryBuilder()
            .select('customer')
            .from(Customer, 'customer')
            .where('customer.username = :username', { username: usernameOrEmail })
            .addSelect('customer.password')
            .getOne();

        if (!customer) {
            customer = await getConnection()
                .createQueryBuilder()
                .select('customer')
                .from(Customer, 'customer')
                .where('customer.email = :email', { email: usernameOrEmail })
                .addSelect('customer.password')
                .getOne();
        }

        if (customer) {
            if (!PasswordHandler.compare(password, customer.password)) {
                throw new Error('Password incorrect.');
            }

            return AuthService.sign(customer);
        }
        throw new Error('Username or email incorrect.');

    }

    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const customer = await Customer.find({ take, skip, order });

        return customer;
    }

    public async create(username: string, email: string, password: string, phoneNumber?: string, fullName?: string,
        avatar?: string, birthday?: Date) {
        if (await Customer.findOne({ where: { username } })) {
            throw new Error(__('customer.username_has_already_used'));
        }
        if (await Customer.findOne({ where: { email } })) {
            throw new Error(__('customer.email_has_already_used'));
        }
        if (await Customer.findOne({ where: { phoneNumber } })) {
            throw new Error(__('customer.phone_number_has_already_used'));
        }

        const newCustomer = new Customer();
        newCustomer.username = username;
        newCustomer.fullName = fullName;
        newCustomer.email = email;
        newCustomer.password = PasswordHandler.encode(password);
        newCustomer.avatar = avatar;
        newCustomer.birthday = birthday;
        newCustomer.phoneNumber = phoneNumber;

        const customer = await newCustomer.save();
        if (!customer) { throw new Error(__('customer.create_fail')); }

        return customer;
    }

    public async edit(id: number, password?: string, phoneNumber?: string, fullName?: string, avatar?: string,
        birthday?: Date) {
        const customer = await Customer.findOne(id);

        if (!customer) {
            throw new Error(__('customer.user_not_found'));
        }

        if (phoneNumber && await Customer.findOne({ where: { phoneNumber } })) {
            throw new Error(__('customer.phone_number_has_already_used'));
        }

        if (password) { customer.password = PasswordHandler.encode(password); }
        if (phoneNumber) { customer.phoneNumber = phoneNumber; }
        if (fullName) { customer.fullName = fullName; }
        if (avatar) { customer.avatar = avatar; }
        if (birthday) { customer.birthday = birthday; }

        return await customer.save();
    }

    public async delete(id: number) {
        const customer = await Customer.findOne(id);

        if (!customer) {
            throw new Error(__('customer.customer_not_found'));
        }

        await customer.remove();
    }

    public async getOne(key: { id?: number, uuid?: string, username?: string, email?: string },
        options?: { withAddresses?: boolean }) {

        if (!key.id && !key.uuid && !key.username && !key.email) {
            throw new Error(__('customer.customer_not_found'));
        }

        let customer: Customer = null;
        const relations = [];

        if (options?.withAddresses) {
            relations.push('addresses');
        }

        if (key.id) {
            customer = await Customer.findOne({ where: { id: key.id }, relations });
        } else if (key.uuid) {
            customer = await Customer.findOne({ where: { uuid: key.uuid }, relations });
        } else if (key.username) {
            customer = await Customer.findOne({ where: { username: key.username }, relations });
        } else {
            customer = await Customer.findOne({ where: { email: key.email }, relations });
        }

        if (!customer) {
            throw new Error(__('customer.customer_not_found'));
        }

        return customer;
    }

    public async addAddress(customerUsername: string, data: {
        address: string, longitude?: number, latitude?: number
    }) {
        const customer = await this.getOne({ username: customerUsername }, { withAddresses: true });
        await AddressService.create(customer.username, data);
    }
}

const customerService = new CustomerService();

export { customerService as CustomerService };

