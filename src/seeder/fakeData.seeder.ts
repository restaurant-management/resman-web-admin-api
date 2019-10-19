import { Customer } from '../entity/customer';
import { User } from '../entity/user';
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

    seedFakeUser();
};

const seedFakeUser = async () => {
    let staff = await User.findOne({ where: {username: 'staff'}});
    if (!staff) {
        staff = new User();
        staff.username = 'staff';
        staff.password = PasswordHandler.encode('staff');
        staff.email = 'staff@gmail.com';
        staff.phoneNumber = '01231234234';
        staff.address = 'Viet Nam';
        await staff.save();
    }

    let chef = await User.findOne({ where: {username: 'chef'}});
    if (!chef) {
        chef = new User();
        chef.username = 'chef';
        chef.password = PasswordHandler.encode('chef');
        chef.email = 'chef@gmail.com';
        chef.phoneNumber = '12323123';
        chef.address = 'Viet Nam';
        await chef.save();
    }
};
