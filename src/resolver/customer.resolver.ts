import { __ } from 'i18n';
import { Arg, Authorized, Ctx, Mutation, Query, UseMiddleware } from 'type-graphql';
import { Address } from '../entity/address';
import { Customer } from '../entity/customer';
import { Permission } from '../entity/permission';
import { GraphCustomerContext } from '../lib/graphContext';
import { CustomerAuthGraph } from '../middleware/customerAuth';
import { AddressService } from '../service/address.service';
import { CustomerService } from '../service/customer.service';

export class CustomerResolver {
    @Query(() => String)
    public async loginAsCustomer(@Arg('usernameOrEmail') usernameOrEmail: string, @Arg('password') password: string) {
        return await CustomerService.authenticate(usernameOrEmail, password);
    }

    @Mutation(() => Customer, { description: 'Public' })
    public async registerAsCustomer(
        @Arg('username') username: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Arg('phoneNumber', { nullable: true }) phoneNumber: string,
        @Arg('fullName', { nullable: true }) fullName: string,
        @Arg('avatar', { nullable: true }) avatar: string,
        @Arg('birthday', { nullable: true }) birthday: Date
    ) {
        return await CustomerService.create({ username, email, password, phoneNumber, fullName, avatar, birthday });
    }

    @Query(() => Customer)
    @UseMiddleware(CustomerAuthGraph)
    public async meAsCustomer(@Ctx() { payload }: GraphCustomerContext) {
        return payload?.customer;
    }

    @Mutation(() => Customer)
    @UseMiddleware(CustomerAuthGraph)
    public async changeProfileAsCustomer(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('phoneNumber', { nullable: true }) phoneNumber: string,
        @Arg('fullName', { nullable: true }) fullName: string,
        @Arg('avatar', { nullable: true }) avatar: string,
        @Arg('birthday', { nullable: true }) birthday: Date
    ) {
        return await CustomerService.editProfile(
            payload.customer.username, payload.customer,
            { phoneNumber, fullName, avatar, birthday });
    }

    @Mutation(() => Address)
    @UseMiddleware(CustomerAuthGraph)
    public async addCustomerAddress(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('address') address: string,
        @Arg('latitude', { nullable: true }) latitude: number,
        @Arg('longitude', { nullable: true }) longitude: number,
    ) {
        return await AddressService.create(payload.customer.username, { address, latitude, longitude });
    }

    @Mutation(() => Address)
    @UseMiddleware(CustomerAuthGraph)
    public async removeCustomerAddress(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('id') id: number,
    ) {
        return await AddressService.delete(payload.customer.username, id);
    }

    @Query(() => Customer, { description: 'For admin' })
    @Authorized([Permission.customer.list])
    public async getCustomer(
        @Arg('username', { nullable: true }) username?: string,
        @Arg('email', { nullable: true }) email?: string
    ) {
        return await CustomerService.getOne(
            { username, email },
            { withAddresses: true }
        );
    }

    @Mutation(() => String)
    @UseMiddleware(CustomerAuthGraph)
    public async changePasswordAsCustomer(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('oldPassword') oldPassword: string,
        @Arg('newPassword') newPassword: string
    ) {
        await CustomerService.changePassword(payload.customer, { oldPassword, newPassword });

        return __('customer.change_password_success');
    }

    @Query(() => [Customer], { description: 'For admin' })
    @Authorized([Permission.customer.list])
    public async customers() {
        return await Customer.find({ relations: ['addresses'] });
    }

    @Mutation(() => Customer, { description: 'For admin' })
    @Authorized([Permission.customer.create])
    public async createCustomer(
        @Arg('username') username: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Arg('phoneNumber', { nullable: true }) phoneNumber: string,
        @Arg('fullName', { nullable: true }) fullName: string,
        @Arg('avatar', { nullable: true }) avatar: string,
        @Arg('birthday', { nullable: true }) birthday: Date
    ) {
        return await CustomerService.create({ username, email, password, phoneNumber, fullName, avatar, birthday });
    }

    @Mutation(() => Customer, { description: 'For admin' })
    @Authorized([Permission.customer.update])
    public async editCustomer(
        @Arg('username') username: string,
        @Arg('password', { nullable: true }) password: string,
        @Arg('phoneNumber', { nullable: true }) phoneNumber: string,
        @Arg('fullName', { nullable: true }) fullName: string,
        @Arg('avatar', { nullable: true }) avatar: string,
        @Arg('birthday', { nullable: true }) birthday: Date
    ) {
        return await CustomerService.edit(username, { password, phoneNumber, fullName, avatar, birthday });
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.customer.delete])
    public async deleteCustomer(
        @Arg('username') username: string
    ) {
        await CustomerService.delete(username);

        return __('customer.delete_success');
    }

    @Mutation(() => Address, { description: 'For admin' })
    @Authorized([Permission.customer.create])
    public async createCustomerAddress(
        @Arg('customerUsername') customerUsername: string,
        @Arg('address') address: string,
        @Arg('latitude', { nullable: true }) latitude: number,
        @Arg('longitude', { nullable: true }) longitude: number,
    ) {
        return await AddressService.create(customerUsername, { address, latitude, longitude });
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.customer.create])
    public async deleteCustomerAddress(
        @Arg('customerUsername') customerUsername: string,
        @Arg('id') id: number
    ) {
        await AddressService.delete(customerUsername, id);

        return __('customer.delete_address_success');
    }
}
