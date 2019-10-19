import i18next, { t } from 'i18next';
import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { Role } from '../entity/role';
import { User } from '../entity/user';
import { PasswordHandler } from '../helper/passwordHandler';

class UserService {
    public async authenticate(usernameOrEmail: string, password: string) {
        let user = await getConnection()
            .createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('user.username = :username', { username: usernameOrEmail })
            .addSelect('user.password')
            .getOne();

        if (!user) {
            user = await getConnection()
                .createQueryBuilder()
                .select('user')
                .from(User, 'user')
                .where('user.email = :email', { email: usernameOrEmail })
                .addSelect('user.password')
                .getOne();
        }

        if (user) {
            if (!PasswordHandler.compare(password, user.password)) {
                throw new Error(t('user_service.password_incorrect'));
            }

            return jwt.sign({ uuid: user.uuid }, process.env.JWT_SECRET_KEY, { expiresIn: `${process.env.USER_TOKEN_EXPIRE_DAY || '1'} days` });
        }
        throw new Error(t('user_service.username_or_email_incorrect'));
    }

    public async getAll(length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1') {
        const order = orderId ? { [orderId]: orderType === 'DESC' || orderType === '-1' ? -1 : 1 } : {};
        const skip = (page - 1) * length >= 0 ? (page - 1) * length : 0;
        const take = length;

        const users = await User.find({ take, skip, order });

        return users;
    }

    public async create(username: string, email: string, password: string, phoneNumber: string, address: string,
                        fullName?: string, avatar?: string, birthday?: Date, roles?: string[]) {
        if (await User.findOne({ where: { username } })) {
            throw new Error(t('user_service.username_has_already_used'));
        }
        if (await User.findOne({ where: { email } })) {
            throw new Error(i18next.t('user_service.email_has_already_used'));
        }
        if (await User.findOne({ where: { phoneNumber } })) {
            throw new Error(t('user_service.phone_number_has_already_used'));
        }

        const listRoles: Role[] = [];

        for (const item of roles) {
            const role = await Role.findOne({ where: { slug: item } });

            if (!role) { throw new Error(t('user_service.role_not_found.')); }

            listRoles.push(role);
        }

        const newUser = new User();
        newUser.username = username;
        newUser.fullName = fullName;
        newUser.email = email;
        newUser.password = PasswordHandler.encode(password);
        newUser.avatar = avatar;
        newUser.birthday = birthday;
        newUser.phoneNumber = phoneNumber;
        newUser.address = address;
        newUser.roles = listRoles;

        const user = await newUser.save();
        if (!user) { throw new Error(t('user_service.create_fail')); }

        return user;
    }
}

const userService = new UserService();

export { userService as UserService };
