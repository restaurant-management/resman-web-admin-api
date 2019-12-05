import { Role } from '../entity/role';
import { User } from '../entity/user';
import { PasswordHandler } from '../helper/passwordHandler';
import { UserService } from '../service/user.service';

/**
 * Please seed role and store before!
 */
export const seedUser = async () => {
    try {
        await UserService.getOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    } catch (e) {
        await UserService.create({
            username: process.env.ADMIN_USERNAME || 'admin',
            email: process.env.ADMIN_USERNAME || 'hienlh1298@gmail.com',
            password: process.env.ADMIN_PASSWORD || 'admin',
            phoneNumber: '0123456789', address: 'Viet Nam',
            roles: [(await Role.findOne({ where: { slug: 'administrator' } })).slug],
            storeIds: [1]
        });
        console.log('Seeded admin user!');
    }

    try {
        await UserService.getOne({ username: 'staff' });
    } catch (e) {
        await UserService.create({
            username: 'staff', email: 'staff@gmail.com', password: 'staff', phoneNumber: '01231234234', address: 'Viet Nam',
            roles: ['staff'], storeIds: [1]
        });
    }

    try {
        await UserService.getOne({ username: 'chef' });
    } catch (e) {
        await UserService.create({
            username: 'chef', email: 'chef@gmail.com', password: 'chef', phoneNumber: '12323123', address: 'Viet Nam',
            roles: ['chef'], storeIds: [1]
        });
    }

    try {
        await UserService.getOne({ username: 'WareManager' });
    } catch (e) {
        await UserService.create({
            username: 'WareManager', email: 'WareManager@gmail.com', password: 'ware_manager', phoneNumber: '03445243234',
            address: 'Viet Nam', roles: ['ware-manager'], storeIds: [1]
        });
    }

    try {
        await UserService.getOne({ username: 'shipper' });
    } catch (e) {
        await UserService.create({
            username: 'shipper', email: 'shipper@gmail.com', password: 'shipper', phoneNumber: '0971963964',
            address: 'Viet Nam', roles: ['shipper'], storeIds: [1]
        });
    }

    if (process.env.NODE_ENV === 'development') {
        const user = await User.findOne({ where: { username: 'user' } });

        if (!user) {
            const newUser = new User();
            newUser.username = 'user';
            newUser.password = PasswordHandler.encode('user');
            newUser.email = 'user@gmail.com';
            newUser.roles = [];
            newUser.phoneNumber = '0123456';
            newUser.address = 'Viet Nam';
            await newUser.save();

            console.log('Seeded user for development!');
        }
    }
};
