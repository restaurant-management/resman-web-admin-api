import { __ } from 'i18n';
import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { Customer } from '../entity/customer';
import { PasswordHandler } from '../helper/passwordHandler';

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

            return jwt.sign({ uuid: customer.uuid }, process.env.JWT_SECRET_KEY, { expiresIn: `${process.env.CUSTOMER_TOKEN_EXPIRE_DAY || '10'} days` });
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

    public async getOne(id: number) {
        const customer = await Customer.findOne(id);

        if (!customer) {
            throw new Error(__('customer.customer_not_found'));
        }

        return customer;
    }
}

const customerService = new CustomerService();

export { customerService as CustomerService };
