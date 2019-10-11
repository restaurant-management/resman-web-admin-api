import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { Customer } from '../entity/customer';
import { PasswordHandler } from '../helper/passwordHandler';

const customerService = {
    authenticate: async (usernameOrEmail: string, password: string) => {
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
};

export { customerService as CustomerService };
