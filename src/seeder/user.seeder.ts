import { Role } from '../entity/role';
import { User } from '../entity/user';
import { PasswordHandler } from '../helper/passwordHandler';

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
