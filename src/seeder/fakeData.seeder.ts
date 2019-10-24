import { Customer } from '../entity/customer';
import { Store } from '../entity/store';
import { User } from '../entity/user';
import { Warehouse } from '../entity/warehouse';
import { PasswordHandler } from '../helper/passwordHandler';

export const seedFakeData = async () => {
    let customer = await Customer.findOne({ where: { username: 'customer' } });

    if (!customer) {
        customer = new Customer();
        customer.username = 'customer';
        customer.email = '16520361@gm.uit.edu.vn';
        customer.password = PasswordHandler.encode('customer');
        await customer.save();

        console.log('Seeded fake data!');
    }

    await seedFakeUser();
    await seedStore();
    await seedWarehouse();
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

const seedStore = async () => {
    let store = await Store.findOne(1);
    if (!store) {
        store = new Store();
        store.name = 'Store';
        store.description = 'Store';
        store.logo = 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4';
        store.address = 'Store';
        store.hotline = '123456';
        await store.save();
    }
};

const seedWarehouse = async () => {
    let warehouse = await Warehouse.findOne(1);
    if (!warehouse) {
        warehouse = new Warehouse();
        warehouse.name = 'Store';
        warehouse.description = 'Store';
        warehouse.address = 'Store';
        warehouse.hotline = '123456';
        await warehouse.save();
    }
};
