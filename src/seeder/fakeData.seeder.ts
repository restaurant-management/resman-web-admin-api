import { Customer } from '../entity/customer';
import { DaySession } from '../entity/dailyDish';
import { Dish } from '../entity/dish';
import { ImportBill } from '../entity/importBill';
import { Stock } from '../entity/stock';
import { Warehouse } from '../entity/warehouse';
import { PasswordHandler } from '../helper/passwordHandler';
import { DailyDishService } from '../service/dailyDish.service';
import { DiscountCodeService } from '../service/discountCode.service';
import { DishService } from '../service/dish.service';
import { ImportBillService } from '../service/importBill.service';
import { StoreService } from '../service/store.service';
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

    await seedStore();
    await seedWarehouse();
    await seedStock();
    await seedImportBill();
    await seedDish();
    await seedDiscountCode();
    await seedDailyDish();

    console.log('Seeded fake data!');
};

const seedStore = async () => {
    try {
        await StoreService.getOne(2);
    } catch (_) {
        await StoreService.create({
            name: 'Store 2',
            address: 'Address 2',
            hotline: '113',
            description: 'Store 2',
            logo: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            openTime: new Date(1998, 1, 1, 6, 0),
            closeTime: new Date(1998, 1, 1, 18, 0)
        });
    }
};

const seedWarehouse = async () => {
    if (!await Warehouse.findOne(1)) {
        await WarehouseService.create({ name: 'Warehouse1', address: 'Warehouse1', hotline: '123456789', description: 'Warehouse1', storeId: 1 });
    }

    if (!await Warehouse.findOne(2)) {
        await WarehouseService.create({ name: 'Warehouse2', address: 'Warehouse2', hotline: '123456789', description: 'Warehouse2', storeId: 1 });
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

const seedImportBill = async () => {
    if (!await ImportBill.findOne(1)) {
        await ImportBillService.create(
            {
                stockIds: [1, 2],
                quantities: [5, 10],
                warehouseId: 1,
                username: 'admin',
                note: 'Test import bill',
                stockPrices: [10, 20],
                stockNotes: ['Gia re', 'ngon']
            }
        );
    }
};

const seedDish = async () => {
    if (!await Dish.findOne(1)) {
        await DishService.create(
            {
                name: 'Canh chua cá diêu hồng',
                description: 'Canh chua cá diêu hồng là một món ăn mang đậm hương vị miền Nam, là món ăn được yêu thích của nhiều gia đình.',
                images: [
                    'https://photo-1-baomoi.zadn.vn/w1000_r1/2018_09_04_353_27570465/e0623ac61d86f4d8ad97.jpg',
                    'https://media.cooky.vn/recipe/g3/20662/s800x500/recipe20662-636360895766543787.jpg'
                ],
                defaultPrice: 25000
            }
        );
    }

    if (!await Dish.findOne(2)) {
        await DishService.create(
            {
                name: 'Canh khổ qua nhồi thịt',
                description: 'Canh khổ qua nhồi thịt cũng là một món ăn ngon giàu dinh dưỡng và dễ làm mà các bạn có thể thực hiện.',
                images: [
                    'https://www.googleapis.com/download/storage/v1/b/restaurant-management-storage.appspot.com/o/dishImages%2FCanh%20kh%E1%BB%95%20qua%20nh%E1%BB%93i%20th%E1%BB%8Bt0-2019-06-07%2001:05:43?generation=1559887548010845&alt=media',
                    'https://www.googleapis.com/download/storage/v1/b/restaurant-management-storage.appspot.com/o/dishImages%2FCanh%20kh%E1%BB%95%20qua%20nh%E1%BB%93i%20th%E1%BB%8Bt1-2019-06-07%2001:05:45?generation=1559887549908602&alt=media',
                    'https://www.googleapis.com/download/storage/v1/b/restaurant-management-storage.appspot.com/o/dishImages%2FCanh%20kh%E1%BB%95%20qua%20nh%E1%BB%93i%20th%E1%BB%8Bt2-2019-06-07%2001:05:47?generation=1559887551753810&alt=media'
                ],
                defaultPrice: 25000
            }
        );
    }

    if (!await Dish.findOne(3)) {
        await DishService.create(
            {
                name: 'Canh khổ qua nhồi thịt Ver 2.0',
                description: 'Canh khổ qua nhồi thịt ver 2.0 y chan ver 1.0.',
                images: [
                    'https://www.googleapis.com/download/storage/v1/b/restaurant-management-storage.appspot.com/o/dishImages%2FCanh%20kh%E1%BB%95%20qua%20nh%E1%BB%93i%20th%E1%BB%8Bt0-2019-06-07%2001:05:43?generation=1559887548010845&alt=media',
                    'https://www.googleapis.com/download/storage/v1/b/restaurant-management-storage.appspot.com/o/dishImages%2FCanh%20kh%E1%BB%95%20qua%20nh%E1%BB%93i%20th%E1%BB%8Bt1-2019-06-07%2001:05:45?generation=1559887549908602&alt=media',
                    'https://www.googleapis.com/download/storage/v1/b/restaurant-management-storage.appspot.com/o/dishImages%2FCanh%20kh%E1%BB%95%20qua%20nh%E1%BB%93i%20th%E1%BB%8Bt2-2019-06-07%2001:05:47?generation=1559887551753810&alt=media'
                ],
                defaultPrice: 30000
            }
        );
    }
};

const seedDailyDish = async () => {
    try {
        if ((await DailyDishService.getBy({ day: new Date() })).length === 0) {
            throw new Error();
        }
    } catch (e) {
        const listDish = await DishService.getAll({});
        for (const dish of listDish) {
            await DailyDishService.create({ day: new Date(), dishId: dish.id, storeId: 1, session: DaySession.None });
        }
    }
};

const seedDiscountCode = async () => {
    try {
        await DiscountCodeService.getOne('RESMAN2019');
    } catch (e) {
        await DiscountCodeService.create({
            code: 'RESMAN2019',
            name: 'Welcome to Resman!',
            startAt: new Date(1998, 1, 1),
            endAt: new Date(2098, 1, 1),
            discount: 100,
            storeIds: [1],
            description: 'Discount for opening Resman',
            minBillPrice: 0,
            maxPriceDiscount: 9999999,
            maxNumber: 99999999,
            isActive: true
        });
    }
};
