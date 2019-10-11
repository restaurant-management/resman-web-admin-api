import { Customer } from '../entity/customer';
import { PasswordHandler } from '../helper/passwordHandler';

export const seedFakeData = async () => {
    let customer = await Customer.findOne({ where: { username: 'customer' } });

    if (!customer) {
        customer = new Customer();
        customer.username = 'customer';
        customer.email = '16520361@gm.uit.edu.vn';
        customer.password = PasswordHandler.encode('customer');
        await customer.save();

        console.log('Seed fake data!');
    }
};
