import { __ } from 'i18n';
import { Arg, Authorized, Ctx, ID, Int, Mutation, Query } from 'type-graphql';
import { DiscountCampaign } from '../entity/discountCampaign';
import { Permission } from '../entity/permission';
import { GraphUserContext } from '../lib/graphContext';
import { DiscountCampaignService } from '../service/discountCampaign.service';

export class DiscountCampaignResolver {
    @Query(() => [DiscountCampaign])
    @Authorized([Permission.discountCampaign.list])
    public async discountCampaigns(
        @Ctx() { payload }: GraphUserContext,
    ) {
        return await DiscountCampaignService.getAllByUser(payload.user);
    }

    @Query(() => DiscountCampaign)
    @Authorized([Permission.discountCampaign.list])
    public async getDiscountCampaign(
        @Arg('id', () => ID) id: number
    ) {
        return await DiscountCampaignService.getOne(id, { withStores: true, withDishes: true });
    }

    @Mutation(() => DiscountCampaign)
    @Authorized([Permission.discountCampaign.create])
    public async createDiscountCampaign(
        @Arg('name') name: string,
        @Arg('startAt') startAt: Date,
        @Arg('endAt') endAt: Date,
        @Arg('defaultDiscount', () => Int) defaultDiscount: number,
        @Arg('storeIds', () => [ID]) storeIds: number[],
        @Arg('description', { nullable: true }) description: string,
        @Arg('dishIds', () => [ID], { nullable: true }) dishIds: number[],
        @Arg('discounts', () => [Int], { nullable: true }) discounts: number[],
        @Arg('banner', () => String, { nullable: true }) banner: string,
    ) {
        return await DiscountCampaignService.create({
            name, startAt, endAt, defaultDiscount, storeIds, description, dishIds, discounts, banner
        });
    }

    @Mutation(() => DiscountCampaign)
    @Authorized([Permission.discountCampaign.update])
    public async editDiscountCampaign(
        @Arg('id', () => ID) id: number,
        @Arg('name') name: string,
        @Arg('startAt') startAt: Date,
        @Arg('endAt') endAt: Date,
        @Arg('defaultDiscount', () => Int) defaultDiscount: number,
        @Arg('storeIds', () => [ID]) storeIds: number[],
        @Arg('description', { nullable: true }) description: string,
        @Arg('dishIds', () => [ID], { nullable: true }) dishIds: number[],
        @Arg('discounts', () => [Int], { nullable: true }) discounts: number[],
        @Arg('banner', () => String, { nullable: true }) banner: string,
    ) {
        return await DiscountCampaignService.edit(id, {
            name, startAt, endAt, defaultDiscount, storeIds, description, dishIds, discounts, banner
        });
    }

    @Mutation(() => String)
    @Authorized([Permission.discountCampaign.delete])
    public async deleteDiscountCampaign(
        @Arg('id', () => ID) id: number,
    ) {
        await DiscountCampaignService.delete(id);

        return __('discount_campaign.delete_success');
    }
}
