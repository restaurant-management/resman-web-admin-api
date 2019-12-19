import { __ } from 'i18n';
import { Arg, Authorized, Ctx, Float, ID, Int, Mutation, Query, UseMiddleware } from 'type-graphql';
import { DiscountCode } from '../entity/discountCode';
import { Permission } from '../entity/permission';
import { GraphUserContext } from '../lib/graphContext';
import { UserAuthGraph } from '../middleware/userAuth';
import { DiscountCodeService } from '../service/discountCode.service';

export class DiscountCodeResolver {
    @Query(() => [DiscountCode])
    @Authorized([Permission.discountCode.list])
    public async discountCodes(
        @Ctx() { payload }: GraphUserContext,
    ) {
        return await DiscountCodeService.getAllByUser(payload.user);
    }

    @Query(() => DiscountCode)
    @Authorized([Permission.discountCode.list])
    public async getDiscountCode(
        @Arg('code') code: string
    ) {
        return await DiscountCodeService.getOne(code, { withStores: true });
    }

    @Query(() => Boolean)
    @UseMiddleware(UserAuthGraph)
    public async isDiscountCodeValid(
        @Arg('code') code: string
    ) {
        await DiscountCodeService.isValid(code);

        return true;
    }

    @Mutation(() => DiscountCode)
    @Authorized([Permission.discountCode.create])
    public async createDiscountCode(
        @Arg('code') code: string,
        @Arg('name') name: string,
        @Arg('startAt') startAt: Date,
        @Arg('endAt') endAt: Date,
        @Arg('discount', () => Float) discount: number,
        @Arg('storeIds', () => [ID]) storeIds: number[],
        @Arg('description', { nullable: true }) description: string,
        @Arg('minBillPrice', () => Float, { nullable: true }) minBillPrice: number,
        @Arg('maxPriceDiscount', () => Float, { nullable: true }) maxPriceDiscount: number,
        @Arg('maxNumber', () => Int, { nullable: true }) maxNumber: number,
        @Arg('isActive', () => Boolean, { nullable: true }) isActive: boolean,
    ) {
        return await DiscountCodeService.create({
            code, name, startAt, endAt, discount, storeIds, description, minBillPrice, maxPriceDiscount,
            maxNumber, isActive
        });
    }

    @Mutation(() => DiscountCode)
    @Authorized([Permission.discountCode.update])
    public async editDiscountCode(
        @Arg('code') code: string,
        @Arg('name') name: string,
        @Arg('startAt') startAt: Date,
        @Arg('endAt') endAt: Date,
        @Arg('discount', () => Float) discount: number,
        @Arg('storeIds', () => [ID]) storeIds: number[],
        @Arg('description', { nullable: true }) description: string,
        @Arg('minBillPrice', () => Float, { nullable: true }) minBillPrice: number,
        @Arg('maxPriceDiscount', () => Float, { nullable: true }) maxPriceDiscount: number,
        @Arg('maxNumber', () => Int, { nullable: true }) maxNumber: number,
        @Arg('isActive', () => Boolean, { nullable: true }) isActive: boolean,
    ) {
        return await DiscountCodeService.edit(code, {
            name, startAt, endAt, discount, storeIds, description, minBillPrice, maxPriceDiscount,
            maxNumber, isActive
        });
    }

    @Mutation(() => String)
    @Authorized([Permission.discountCode.delete])
    public async deleteDiscountCode(
        @Arg('code') code: string
    ) {
        await DiscountCodeService.delete(code);

        return __('discount_code.delete_success');
    }
}
