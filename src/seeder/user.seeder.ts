import { Role } from '../entity/role';
import { User } from '../entity/user';
import { PasswordHandler } from '../helper/passwordHandler';
import { UserService } from '../service/user.service';

/**
 * Please seed role before!
 */
export const seedUser = async () => {
    const adminUser = await User.findOne({ where: { username: 'admin' } });

    if (!adminUser) {
        const newUser = new User();
        newUser.username = process.env.ADMIN_USERNAME || 'admin';
        newUser.password = PasswordHandler.encode(process.env.ADMIN_PASSWORD || 'admin');
        newUser.email = 'hienlh1298@gmail.com';
        newUser.roles = [await Role.findOne({ where: { slug: 'administrator' } })];
        newUser.phoneNumber = '0123456789';
        newUser.address = 'Viet Nam';
        await newUser.save();

        console.log('Seeded admin user!');
    }

    try {
        await UserService.getOne({ username: 'staff' });
    } catch (e) {
        await UserService.create('staff', 'staff@gmail.com', 'staff', '01231234234', 'Viet Nam',
            null, null, null, ['staff']);
    }

    try {
        await UserService.getOne({ username: 'chef' });
    } catch (e) {
        await UserService.create('chef', 'chef@gmail.com', 'chef', '12323123', 'Viet Nam',
            null, null, null, ['chef']);
    }

    try {
        await UserService.getOne({ username: 'WareManager' });
    } catch (e) {
        await UserService.create('WareManager', 'WareManager@gmail.com', 'ware_manager', '03445243234', 'Viet Nam',
            null, null, null, ['ware-manager']);
    }

    try {
        await UserService.getOne({ username: 'shipper' });
    } catch (e) {
        await UserService.create('shipper', 'shipper@gmail.com', 'shipper', '0971963964', 'Viet Nam',
            null, null, null, ['shipper']);
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
