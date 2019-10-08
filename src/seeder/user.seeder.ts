import { Role } from '../entity/role';
import { User } from '../entity/user';
import { PasswordHandler } from '../helper/passwordHandler';

/**
 * Please seed role before!
 */
export const seedUser = async () => {
    const [, userCount] = await User.findAndCount();

    if (userCount <= 0) {
        let newUser = new User();
        newUser.username = process.env.ADMIN_USERNAME || 'admin';
        newUser.password = PasswordHandler.encode(process.env.ADMIN_PASSWORD || 'admin');
        newUser.email = 'hienlh1298@gmail.com';
        newUser.roles = [await Role.findOne({ where: { slug: 'administrator' } })];
        newUser.phoneNumber = '0123456789';
        newUser.address = 'Viet Nam';
        await newUser.save();

        console.log('Seeded user!');
    }
};
