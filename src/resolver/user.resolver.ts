import { __ } from 'i18n';
import { Arg, Authorized, Ctx, ID, Int, Mutation, Query, UseMiddleware } from 'type-graphql';
import { Permission } from '../entity/permission';
import { User } from '../entity/user';
import { GraphUserContext } from '../lib/graphContext';
import { UserAuthGraph } from '../middleware/userAuth';
import { UserService } from '../service/user.service';

export class UserResolver {
    @Query(() => String)
    public async testLanguage() {
        return __('welcome_to_resman');
    }
    @Query(() => String)
    public async loginAsUser(@Arg('usernameOrEmail') usernameOrEmail: string, @Arg('password') password: string) {
        return await UserService.authenticate(usernameOrEmail, password);
    }

    @Query(() => User)
    @UseMiddleware(UserAuthGraph)
    public async meAsUser(@Ctx() { payload }: GraphUserContext) {
        return payload?.user;
    }

    @Mutation(() => User, { description: 'For admin' })
    @UseMiddleware(UserAuthGraph)
    public async changeProfileAsUser(
        @Ctx() { payload }: GraphUserContext,
        @Arg('address', { nullable: true }) address: string,
        @Arg('phoneNumber', { nullable: true }) phoneNumber: string,
        @Arg('fullName', { nullable: true }) fullName: string,
        @Arg('avatar', { nullable: true }) avatar: string,
        @Arg('birthday', { nullable: true }) birthday: Date
    ) {
        return await UserService.edit(payload.user.username, payload.user, {
            phoneNumber, fullName, address, avatar, birthday
        });
    }

    @Query(() => [User], { description: 'For admin' })
    @Authorized([Permission.user.list])
    public async users() {
        return await User.find({ relations: ['stores', 'roles'] });
    }

    @Query(() => [User], { description: 'For admin' })
    @Authorized([Permission.user.list, Permission.dish.create, Permission.dish.update])
    public async usersByRole(
        @Arg('roleSlugs', () => [String]) roleSlugs?: string[]) {
        const users = await this.users();

        return users.filter(e => e.roles.find(role => roleSlugs.find(roleSlug => roleSlug === role.slug)));
    }

    @Query(() => User)
    @Authorized([Permission.user.list])
    public async getUser(
        @Arg('username', { nullable: true }) username?: string,
        @Arg('email', { nullable: true }) email?: string
    ) {
        return await UserService.getOne(
            { username, email },
            { withRoles: true, withStores: true, withWarehouses: true }
        );
    }

    @Mutation(() => String)
    @UseMiddleware(UserAuthGraph)
    public async changePasswordAsUser(
        @Ctx() { payload }: GraphUserContext,
        @Arg('oldPassword') oldPassword: string,
        @Arg('newPassword') newPassword: string
    ) {
        await UserService.changePassword(payload.user, { oldPassword, newPassword });

        return __('user.change_password_success');
    }

    @Mutation(() => User, { description: 'For admin' })
    @Authorized([Permission.user.create])
    public async createUser(
        @Ctx() { payload }: GraphUserContext,
        @Arg('username') username: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Arg('address') address: string,
        @Arg('phoneNumber') phoneNumber: string,
        @Arg('fullName', { nullable: true }) fullName: string,
        @Arg('birthday', { nullable: true }) birthday: Date,
        @Arg('avatar', { nullable: true }) avatar: string,
        @Arg('roles', () => [String], { nullable: true }) roles: string[],
        @Arg('storeIds', () => [Int], { nullable: true }) storeIds: number[],
        @Arg('warehouseIds', () => [Int], { nullable: true }) warehouseIds: number[],
    ) {
        if (!await UserService.checkRoleLevel(payload.user.id, roles)) {
            throw new Error(__('user.can_not_create_user_with_higher_level'));
        }

        return await UserService.create({
            username, email, password, phoneNumber, fullName, address, avatar, roles, storeIds, birthday, warehouseIds
        });
    }

    @Mutation(() => User, { description: 'For admin' })
    @Authorized([Permission.user.update])
    public async editUser(
        @Ctx() { payload }: GraphUserContext,
        @Arg('username', { nullable: true }) username: string,
        @Arg('password', { nullable: true }) password: string,
        @Arg('address', { nullable: true }) address: string,
        @Arg('phoneNumber', { nullable: true }) phoneNumber: string,
        @Arg('fullName', { nullable: true }) fullName: string,
        @Arg('avatar', { nullable: true }) avatar: string,
        @Arg('birthday', { nullable: true }) birthday: Date,
        @Arg('roles', () => [String], { nullable: true }) roles: string[],
        @Arg('storeIds', () => [Int], { nullable: true }) storeIds: number[],
        @Arg('warehouseIds', () => [Int], { nullable: true }) warehouseIds: number[],
    ) {
        if (!(await UserService.checkRoleLevel(payload.user.id, roles))) {
            throw new Error(__('user.can_not_create_user_with_higher_level'));
        }

        return await UserService.edit(username, payload.user, {
            password, phoneNumber, fullName, address, avatar, roles, storeIds, birthday, warehouseIds
        });
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.user.delete])
    public async deleteUser(
        @Ctx() { payload }: GraphUserContext,
        @Arg('username') username: string
    ) {
        await UserService.delete(username, payload.user);

        return __('user.delete_success');
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.user.delete])
    public async deleteUsers(
        @Ctx() { payload }: GraphUserContext,
        @Arg('usernames', () => [String]) usernames: string[]
    ) {
        await UserService.multiDelete(usernames, payload.user);

        return __('user.delete_success');
    }

    @Mutation(() => User, { description: 'For admin' })
    @Authorized([Permission.user.update])
    public async addUserToWarehouse(
        @Arg('username') username: string,
        @Arg('warehouseId', () => ID) warehouseId: number
    ) {
        return await UserService.addWareHouse(username, warehouseId);
    }
}
