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
