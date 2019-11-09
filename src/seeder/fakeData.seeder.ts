import { Customer } from '../entity/customer';
import { Dish } from '../entity/dish';
import { ImportBill } from '../entity/importBill';
import { Stock } from '../entity/stock';
import { Store } from '../entity/store';
import { User } from '../entity/user';
import { Warehouse } from '../entity/warehouse';
import { PasswordHandler } from '../helper/passwordHandler';
import { DishService } from '../service/dish.service';
import { ImportBillService } from '../service/importBill.service';
import { WarehouseService } from '../service/warehouse.service';

export const seedFakeData = async () => {
    console.info('Seeding fake data...');

    let customer = await Customer.findOne({ where: { username: 'customer' } });

    if (!customer) {
        customer = new Customer();
        customer.username = 'customer';
        customer.email = '16520361@gm.uit.edu.vn';
        customer.password = PasswordHandler.encode('customer');
        await customer.save();
    }

    await seedFakeUser();
    await seedStore();
    await seedWarehouse();
    await seedStock();
    await seedImportBill();
    await seedDish();
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
        console.log('Seeded store!');
    }
};

const seedWarehouse = async () => {
    if (!await Warehouse.findOne(1)) {
        await WarehouseService.create('Warehouse1', 'Warehouse1', '123456789', 'Warehouse1', 1);
    }

    if (!await Warehouse.findOne(2)) {
        await WarehouseService.create('Warehouse2', 'Warehouse2', '123456789', 'Warehouse2', 1);
    }
    console.log('Seeded warehouse!');
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
    console.log('Seeded stock!');
};

const seedImportBill = async () => {
    if (!await ImportBill.findOne(1)) {
        await ImportBillService.create(
            [1, 2],
            [5, 10],
            1,
            'admin',
            'Test import bill',
            [10, 20],
            ['Gia re', 'ngon']
        );
        console.log('Seeded import bill!');
    }
};

const seedDish = async () => {
    if (!await Dish.findOne(1)) {
        await DishService.create(
            'Canh chua cá diêu hồng',
            'Canh chua cá diêu hồng là một món ăn mang đậm hương vị miền Nam, là món ăn được yêu thích của nhiều gia đình.',
            [
                'https://photo-1-baomoi.zadn.vn/w1000_r1/2018_09_04_353_27570465/e0623ac61d86f4d8ad97.jpg',
                'https://media.cooky.vn/recipe/g3/20662/s800x500/recipe20662-636360895766543787.jpg'
            ],
            25000
        );
    }

    if (!await Dish.findOne(2)) {
        await DishService.create(
            'Canh khổ qua nhồi thịt',
            'Canh khổ qua nhồi thịt cũng là một món ăn ngon giàu dinh dưỡng và dễ làm mà các bạn có thể thực hiện.',
            [
                'https://www.googleapis.com/download/storage/v1/b/restaurant-management-storage.appspot.com/o/dishImages%2FCanh%20kh%E1%BB%95%20qua%20nh%E1%BB%93i%20th%E1%BB%8Bt0-2019-06-07%2001:05:43?generation=1559887548010845&alt=media',
                'https://www.googleapis.com/download/storage/v1/b/restaurant-management-storage.appspot.com/o/dishImages%2FCanh%20kh%E1%BB%95%20qua%20nh%E1%BB%93i%20th%E1%BB%8Bt1-2019-06-07%2001:05:45?generation=1559887549908602&alt=media',
                'https://www.googleapis.com/download/storage/v1/b/restaurant-management-storage.appspot.com/o/dishImages%2FCanh%20kh%E1%BB%95%20qua%20nh%E1%BB%93i%20th%E1%BB%8Bt2-2019-06-07%2001:05:47?generation=1559887551753810&alt=media'
            ],
            25000
        );
    }
    console.log('Seeded import bill!');
};
