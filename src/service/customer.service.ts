import { __ } from 'i18n';
import { getConnection } from 'typeorm';
import { Customer } from '../entity/customer';
import { PasswordHandler } from '../helper/passwordHandler';
import { HttpError } from '../lib/httpError';
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

    public async create(data: {
        username: string, email: string, password: string,
        phoneNumber?: string, fullName?: string, avatar?: string, birthday?: Date
    }) {
        if (!data.username || !data.email || !data.password) {
            throw new Error(__('error.missing_required_information'));
        }

        if (await Customer.findOne({ where: { username: data.username } })) {
            throw new Error(__('user.username_has_already_used'));
        }
        if (await Customer.findOne({ where: { email: data.email } })) {
            throw new Error(__('user.email_has_already_used'));
        }
        if (data.phoneNumber && await Customer.findOne({ where: { phoneNumber: data.phoneNumber } })) {
            throw new Error(__('user.phone_number_has_already_used'));
        }

        const newCustomer = new Customer();
        newCustomer.username = data.username;
        newCustomer.fullName = data.fullName;
        newCustomer.email = data.email;
        newCustomer.password = PasswordHandler.encode(data.password);
        newCustomer.avatar = data.avatar;
        newCustomer.birthday = data.birthday;
        newCustomer.phoneNumber = data.phoneNumber;

        const customer = await newCustomer.save();
        if (!customer) { throw new Error(__('customer.create_fail')); }

        return await this.getOne({ username: newCustomer.username }, { withAddresses: true });
    }

    public async edit(username: string, data: {
        password?: string, phoneNumber?: string, fullName?: string, avatar?: string, birthday?: Date
    }) {
        const customer = await this.getOne({ username });

        if (!customer) {
            throw new Error(__('customer.user_not_found'));
        }

        if (data.phoneNumber && await Customer.findOne({ where: { phoneNumber: data.phoneNumber } })) {
            throw new Error(__('customer.phone_number_has_already_used'));
        }

        if (data.password) { customer.password = PasswordHandler.encode(data.password); }
        if (data.phoneNumber) { customer.phoneNumber = data.phoneNumber; }
        if (data.fullName) { customer.fullName = data.fullName; }
        if (data.avatar) { customer.avatar = data.avatar; }
        if (data.birthday) { customer.birthday = data.birthday; }

        return await customer.save();
    }

    public async delete(username: string) {
        const customer = await this.getOne({ username });

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

    public async addAddress(username: string, data: {
        address: string, longitude?: number, latitude?: number
    }) {
        const customer = await this.getOne({ username }, { withAddresses: true });
        await AddressService.create(customer.username, data);
    }

    // Edit profile for customer
    public async editProfile(username: string, editBy: Customer, data: {
        password?: string, phoneNumber?: string, fullName?: string, avatar?: string, birthday?: Date
    }) {
        if (username !== editBy.username) {
            throw new HttpError(401, __('authentication.unauthorized'));
        }

        const customer = await this.getOne({ username }, { withAddresses: true });

        if (!customer) {
            throw new Error(__('customer.user_not_found'));
        }

        if (data.phoneNumber && await Customer.findOne({ where: { phoneNumber: data.phoneNumber } })) {
            throw new Error(__('customer.phone_number_has_already_used'));
        }

        if (data.password) { customer.password = PasswordHandler.encode(data.password); }
        if (data.phoneNumber) { customer.phoneNumber = data.phoneNumber; }
        if (data.fullName) { customer.fullName = data.fullName; }
        if (data.avatar) { customer.avatar = data.avatar; }
        if (data.birthday) { customer.birthday = data.birthday; }

        return await customer.save();
    }

    // For customer
    public async changePassword(editBy: Customer, data: { oldPassword: string, newPassword: string }) {
        if (!PasswordHandler.validate(data.newPassword)) {
            throw new Error(__('error.password_invalidate'));
        }
        if (data.newPassword === data.oldPassword) {
            throw new Error(__('error.new_password_must_be_difference_old_password'));
        }

        const customer = await Customer.findOne({ where: { username: editBy.username }, select: ['password'] });

        if (!PasswordHandler.compare(data.oldPassword, customer.password)) {
            throw new Error(__('error.incorrect_old_password'));
        }

        return this.edit(editBy.username, { password: data.newPassword });
    }
}

const customerService = new CustomerService();

export { customerService as CustomerService };
