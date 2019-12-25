import { __ } from 'i18n';
import { Arg, Authorized, Ctx, Float, ID, Mutation, Query, UseMiddleware } from 'type-graphql';
import { Permission } from '../entity/permission';
import { VoucherCode } from '../entity/voucherCode';
import { GraphCustomerContext, GraphUserContext } from '../lib/graphContext';
import { CustomerAuthGraph } from '../middleware/customerAuth';
import { UserAuthGraph } from '../middleware/userAuth';
import { VoucherCodeService } from '../service/voucherCode.service';

export class VoucherCodeResolver {
    @Query(() => [VoucherCode])
    @Authorized([Permission.voucherCode.list])
    public async voucherCodes(
        @Ctx() { payload }: GraphUserContext,
    ) {
        return await VoucherCodeService.getAllByUser(payload.user);
    }

    @Query(() => VoucherCode)
    @UseMiddleware(CustomerAuthGraph)
    public async getVoucherCode(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('code') code: string
    ) {
        return await VoucherCodeService.getOne(code, {
            withStores: true, withCustomer: true, customer: payload.customer
        });
    }

    @Query(() => VoucherCode)
    @Authorized([Permission.voucherCode.list])
    public async getVoucherCodeByAdmin(
        @Arg('code') code: string
    ) {
        return await VoucherCodeService.getOne(code, { withStores: true, withCustomer: true });
    }

    @Query(() => Boolean)
    @UseMiddleware(UserAuthGraph)
    public async isVoucherCodeValid(
        @Arg('code') code: string
    ) {
        await VoucherCodeService.isValid(code);

        return true;
    }

    @Mutation(() => VoucherCode)
    @Authorized([Permission.voucherCode.create])
    public async createVoucherCode(
        @Arg('name') name: string,
        @Arg('startAt') startAt: Date,
        @Arg('endAt') endAt: Date,
        @Arg('value', () => Float) value: number,
        @Arg('storeIds', () => [ID]) storeIds: number[],
        @Arg('description', { nullable: true }) description: string,
        @Arg('minBillPrice', () => Float, { nullable: true }) minBillPrice: number,
        @Arg('maxPriceDiscount', () => Float, { nullable: true }) maxPriceDiscount: number,
        @Arg('image', { nullable: true }) image: string,
        @Arg('isActive', () => Boolean, { nullable: true }) isActive: boolean,
        @Arg('isPercent', () => Boolean, { nullable: true }) isPercent: boolean,
        @Arg('customerUuid', () => String, { nullable: true }) customerUuid: string,
    ) {
        return await VoucherCodeService.create({
            name, startAt, endAt, value, storeIds, description, minBillPrice, maxPriceDiscount, isActive, image,
            isPercent, customerUuid
        });
    }

    @Mutation(() => VoucherCode)
    @Authorized([Permission.voucherCode.update])
    public async editVoucherCode(
        @Arg('code') code: string,
        @Arg('name', { nullable: true }) name: string,
        @Arg('startAt', { nullable: true }) startAt: Date,
        @Arg('endAt', { nullable: true }) endAt: Date,
        @Arg('value', () => Float, { nullable: true }) value: number,
        @Arg('storeIds', () => [ID], { nullable: true }) storeIds: number[],
        @Arg('description', { nullable: true }) description: string,
        @Arg('minBillPrice', () => Float, { nullable: true }) minBillPrice: number,
        @Arg('maxPriceDiscount', () => Float, { nullable: true }) maxPriceDiscount: number,
        @Arg('image', { nullable: true }) image: string,
        @Arg('isActive', () => Boolean, { nullable: true }) isActive: boolean,
        @Arg('isPercent', () => Boolean, { nullable: true }) isPercent: boolean,
    ) {
        return await VoucherCodeService.edit(code, {
            name, startAt, endAt, value, storeIds, description, minBillPrice, maxPriceDiscount,
            isActive, image, isPercent
        });
    }

    @Mutation(() => String)
    @Authorized([Permission.voucherCode.delete])
    public async deleteVoucherCode(
        @Arg('code') code: string
    ) {
        await VoucherCodeService.delete(code);

        return __('voucher_code.delete_success');
    }
}
