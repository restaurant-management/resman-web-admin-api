import { Customer } from '../entity/customer';
import { Stock } from '../entity/stock';
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
    await seedStock();
};

const seedFakeUser = async () => {
    let staff = await User.findOne({ where: { username: 'staff' } });
    if (!staff) {
        staff = new User();
        staff.username = 'staff';
        staff.password = PasswordHandler.encode('staff');
        staff.email = 'staff@gmail.com';
        staff.phoneNumber = '01231234234';
        staff.address = 'Viet Nam';
        await staff.save();
    }

    let chef = await User.findOne({ where: { username: 'chef' } });
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
        warehouse.name = 'Warehouse1';
        warehouse.description = 'Warehouse1';
        warehouse.address = 'Warehouse1';
        warehouse.hotline = '123456';
        await warehouse.save();
    }

    warehouse = await Warehouse.findOne(2);
    if (!warehouse) {
        warehouse = new Warehouse();
        warehouse.name = 'Warehouse2';
        warehouse.description = 'Warehouse2';
        warehouse.address = 'Warehouse2';
        warehouse.hotline = '123456';
        await warehouse.save();
    }
};

const seedStock = async () => {
    let stock = await Stock.findOne(1);
    if (!stock) {
        stock = new Stock();
        stock.name = 'Fish';
        stock.price = 20000;
        stock.unit = 'KG';
        await stock.save();
    }

    stock = await Stock.findOne(2);
    if (!stock) {
        stock = new Stock();
        stock.name = 'Hotdog';
        stock.price = 50000;
        stock.unit = 'Bag';
        await stock.save();
    }

    stock = await Stock.findOne(3);
    if (!stock) {
        stock = new Stock();
        stock.name = 'Milk';
        stock.price = 10000;
        stock.unit = 'Box';
        await stock.save();
    }
};
