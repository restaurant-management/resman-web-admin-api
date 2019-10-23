import { __ } from 'i18n';
import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { Role } from '../entity/role';
import { User } from '../entity/user';
import { PasswordHandler } from '../helper/passwordHandler';

class UserService {
    /**
     *  Check if user have roles with level enough with require.
     * @param userId  User to check.
     * @param requireLevelRoles List role slugs to get require level.
     */
    public async checkRoleLevel(userId: number, requireLevelRoles: string[] = []): Promise<boolean> {
        const user = await User.findOne(userId);
        let highestUserRoleLevel = 0;
        let requireRoleLevel = 0;

        for (const role of user.roles) {
            if (highestUserRoleLevel < role.level) {
                highestUserRoleLevel = role.level;
            }
        }

        for (const slug of requireLevelRoles) {
            const role = await Role.findOne({ where: { slug } });
            if (requireRoleLevel < role.level) {
                requireRoleLevel = role.level;
            }
        }

        return highestUserRoleLevel >= requireRoleLevel;
    }

    /**
     *  Check if user have roles with level enough with require.
     * @param userId  User to check. 
     * @param requireLevelOfUserId   User to get list role slugs to get require level.
     */
    public async checkRoleLevelByUser(userId: number, requireLevelOfUserId: number): Promise<boolean> {
        const user = await User.findOne(userId);
        const requireUser = await User.findOne(requireLevelOfUserId);
        let highestUserRoleLevel = 0;
        let requireRoleLevel = 0;

        for (const role of user.roles) {
            if (highestUserRoleLevel < role.level) {
                highestUserRoleLevel = role.level;
            }
        }

        for (const role of requireUser.roles) {
            if (requireRoleLevel < role.level) {
                requireRoleLevel = role.level;
            }
        }

        return highestUserRoleLevel >= requireRoleLevel;
    }

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
                throw new Error(__('user.password_incorrect'));
            }

            return jwt.sign({ uuid: user.uuid }, process.env.JWT_SECRET_KEY, { expiresIn: `${process.env.USER_TOKEN_EXPIRE_DAY || '1'} days` });
        }
        throw new Error(__('user.username_or_email_incorrect'));
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
            throw new Error(__('user.username_has_already_used'));
        }
        if (await User.findOne({ where: { email } })) {
            throw new Error(__('user.email_has_already_used'));
        }
        if (await User.findOne({ where: { phoneNumber } })) {
            throw new Error(__('user.phone_number_has_already_used'));
        }

        const listRoles: Role[] = [];

        if (roles) {
            for (const item of roles) {
                const role = await Role.findOne({ where: { slug: item } });

                if (!role) { throw new Error(__('user.{{role}}_not_found', { role: item })); }

                listRoles.push(role);
            }
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
        if (!user) { throw new Error(__('user.create_fail')); }

        return user;
    }

    public async edit(id: number, password?: string, phoneNumber?: string, address?: string,
                      fullName?: string, avatar?: string, birthday?: Date, roles?: string[]) {
        const user = await User.findOne(id);

        if (address === '') {
            throw new Error(__('user.address_must_be_not_empty'));
        }

        if (!user) {
            throw new Error(__('user.user_not_found'));
        }

        if (await User.findOne({ where: { phoneNumber } })) {
            throw new Error(__('user.phone_number_has_already_used'));
        }

        const listRoles: Role[] = user.roles;

        if (roles) {
            for (const item of roles) {
                const role = await Role.findOne({ where: { slug: item } });

                if (!role) { throw new Error(__('user.{{role}}_not_found', { role: item })); }

                listRoles.push(role);
            }
        }

        user.password = PasswordHandler.encode(password);
        user.phoneNumber = phoneNumber;
        if (address) { user.address = address; }
        if (fullName) { user.fullName = fullName; }
        if (avatar) { user.avatar = avatar; }
        if (birthday) { user.birthday = birthday; }
        user.roles = listRoles;

        return await user.save();
    }

    public async delete(id: number) {
        if (id === 1) {
            throw new Error(__('user.can_not_delete_admin_user'));
        }

        const user = await User.findOne(id);

        if (!user) {
            throw new Error(__('user.user_not_found'));
        }

        await user.remove();
    }

    public async getOne(id: number) {
        const user = await User.findOne(id);

        if (!user) {
            throw new Error(__('user.user_not_found'));
        }

        return user;
    }
}

const userService = new UserService();

export { userService as UserService };
