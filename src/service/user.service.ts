import { __ } from 'i18n';
import { getConnection } from 'typeorm';
import { Role } from '../entity/role';
import { Store } from '../entity/store';
import { User } from '../entity/user';
import { PasswordHandler } from '../helper/passwordHandler';
import { AuthService } from './authService';
import { StoreService } from './store.service';
import { WarehouseService } from './warehouse.service';

class UserService {
    /**
     *  Check if user have roles with level enough with require.
     * @param userId  User to check.
     * @param requireLevelRoles List role slugs to get require level.
     */
    public async checkRoleLevel(userId: number, requireLevelRoles: string[] = []): Promise<boolean> {
        const user = await User.findOne(userId, { relations: ['roles'] });
        let highestUserRoleLevel = 0;
        let requireRoleLevel = 0;

        for (const role of user.roles) {
            if (highestUserRoleLevel < role.level) {
                highestUserRoleLevel = role.level;
            }
        }

        for (const slug of requireLevelRoles) {
            const role = await Role.findOne({ where: { slug } });
            if (role && requireRoleLevel < role.level) {
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
            if (role && highestUserRoleLevel < role.level) {
                highestUserRoleLevel = role.level;
            }
        }

        for (const role of requireUser.roles) {
            if (role && requireRoleLevel < role.level) {
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

            return AuthService.sign(user);
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

    public async create(data: {
        username: string, email: string, password: string, phoneNumber: string, address: string,
        fullName?: string, avatar?: string, birthday?: Date, roles?: string[], storeIds?: number[]
    }) {
        if (!data.username || !data.email || !data.password || !data.phoneNumber) {
            throw new Error(__('error.missing_required_information'));
        }
        if (await User.findOne({ where: { username: data.username } })) {
            throw new Error(__('user.username_has_already_used'));
        }
        if (await User.findOne({ where: { email: data.email } })) {
            throw new Error(__('user.email_has_already_used'));
        }
        if (await User.findOne({ where: { phoneNumber: data.phoneNumber } })) {
            throw new Error(__('user.phone_number_has_already_used'));
        }

        const listRoles: Role[] = [];

        if (data.roles) {
            for (const item of data.roles) {
                const role = await Role.findOne({ where: { slug: item } });

                if (!role) { throw new Error(__('user.{{role}}_not_found', { role: item })); }

                listRoles.push(role);
            }
        }

        const listStores: Store[] = [];
        if (data.storeIds) {
            for (const item of data.storeIds) {
                const store = await StoreService.getOne(item);
                listStores.push(store);
            }
        }

        const newUser = new User();
        newUser.username = data.username;
        newUser.fullName = data.fullName;
        newUser.email = data.email;
        newUser.password = PasswordHandler.encode(data.password);
        newUser.avatar = data.avatar;
        newUser.birthday = data.birthday;
        newUser.phoneNumber = data.phoneNumber;
        newUser.address = data.address;
        newUser.roles = listRoles;
        newUser.stores = listStores;

        const user = await newUser.save();
        if (!user) { throw new Error(__('user.create_fail')); }

        return user;
    }

    public async edit(username: string, editBy: User, data: {
        password?: string, phoneNumber?: string, address?: string,
        fullName?: string, avatar?: string, birthday?: Date, roles?: string[], storeIds?: number[]
    }) {
        const user = await this.getOne({ username },
            { withRoles: true, withStores: true, withWarehouses: true });

        if (!this.checkRoleLevel(editBy.id, user.roles.map(item => item.slug))) {
            throw new Error(__('user.can_not_update_user_with_higher_level'));
        }

        if (data.address === '') {
            throw new Error(__('user.address_must_be_not_empty'));
        }

        if (!user) {
            throw new Error(__('user.user_not_found'));
        }

        if (data.phoneNumber) {
            const samePhone = await User.findOne({ where: { phoneNumber: data.phoneNumber } });
            if (samePhone && samePhone.username !== username) {
                throw new Error(__('user.phone_number_has_already_used'));
            }
        }

        let listRoles: Role[] = user.roles;

        if (data.roles) {
            listRoles = [];
            for (const item of data.roles) {
                const role = await Role.findOne({ where: { slug: item } });

                if (!role) { throw new Error(__('user.{{role}}_not_found', { role: item })); }

                listRoles.push(role);
            }
        }

        let listStores: Store[] = user.stores;
        if (data.storeIds) {
            listStores = [];
            for (const item of data.storeIds) {
                const store = await StoreService.getOne(item);
                listStores.push(store);
            }
        }

        if (data.password) { user.password = PasswordHandler.encode(data.password); }
        if (data.phoneNumber) { user.phoneNumber = data.phoneNumber; }
        if (data.address) { user.address = data.address; }
        if (data.fullName) { user.fullName = data.fullName; }
        if (data.avatar) { user.avatar = data.avatar; }
        if (data.birthday) { user.birthday = data.birthday; }
        user.roles = listRoles;
        user.stores = listStores;

        await user.save();

        return await this.getOne({ username }, { withRoles: true, withStores: true, withWarehouses: true });
    }

    public async delete(username: string, deleteBy: User) {
        if (username === 'admin') {
            throw new Error(__('user.can_not_delete_admin_user'));
        }

        const user = await this.getOne({ username }, { withRoles: true });

        if (!await this.checkRoleLevel(deleteBy.id, user.roles.map(i => i.slug))) {
            throw new Error(__('user.can_not_delete_user_with_higher_level'));
        }

        if (!user) {
            throw new Error(__('user.user_not_found'));
        }

        await user.remove();
    }

    public async getOne(key: { id?: number, uuid?: string, username?: string, email?: string },
        options?: { withRoles?: boolean, withStores?: boolean, withWarehouses?: boolean }) {

        if (!key.id && !key.uuid && !key.username && !key.email) {
            throw new Error(__('user.user_not_found'));
        }

        let user: User = null;
        const relations = [];
        if (options?.withRoles) { relations.push('roles'); }
        if (options?.withStores) { relations.push('stores'); }
        if (options?.withWarehouses) { relations.push('warehouses'); }

        if (key.id) {
            user = await User.findOne({ relations, where: { id: key.id } });
        } else if (key.uuid) {
            user = await User.findOne({ relations, where: { uuid: key.uuid } });
        } else if (key.username) {
            user = await User.findOne({ relations, where: { username: key.username } });
        } else {
            user = await User.findOne({ relations, where: { email: key.email } });
        }

        if (!user) {
            throw new Error(__('user.user_not_found'));
        }

        return user;
    }

    // For user
    public async changePassword(editBy: User, data: { oldPassword: string, newPassword: string }) {
        if (!PasswordHandler.validate(data.newPassword)) {
            throw new Error(__('error.password_invalidate'));
        }
        if (data.newPassword === data.oldPassword) {
            throw new Error(__('error.new_password_must_be_difference_old_password'));
        }

        const user = await User.findOne({ where: { username: editBy.username }, select: ['password'] });

        if (!PasswordHandler.compare(data.oldPassword, user.password)) {
            throw new Error(__('error.incorrect_old_password'));
        }

        return this.edit(editBy.username, editBy, { password: data.newPassword });
    }

    public async addWareHouse(username: string, warehouseId: number) {
        const user = await this.getOne({ username }, { withWarehouses: true });
        const warehouse = await WarehouseService.getOne(warehouseId);

        user.warehouses.push(warehouse);
        await user.save({ reload: true });

        return this.getOne({ username }, { withRoles: true, withStores: true, withWarehouses: true });
    }
}

const userService = new UserService();

export { userService as UserService };
