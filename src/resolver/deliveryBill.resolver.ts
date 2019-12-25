import { __ } from 'i18n';
import { Arg, Authorized, Ctx, Float, ID, Int, Mutation, Query, UseMiddleware } from 'type-graphql';
import { DeliveryBill } from '../entity/deliveryBill';
import { Permission } from '../entity/permission';
import { GraphCustomerContext, GraphUserContext } from '../lib/graphContext';
import { AuthorRoleGraphMiddleware } from '../middleware/authorizationByRole';
import { CustomerAuthGraph } from '../middleware/customerAuth';
import { UserAuthGraph } from '../middleware/userAuth';
import { DeliveryBillService } from '../service/deliveryBill.service';

export class DeliveryBillResolver {
    @Query(() => [DeliveryBill], { description: 'Get by customer' })
    @UseMiddleware(CustomerAuthGraph)
    public async deliveryBills(
        @Ctx() { payload }: GraphCustomerContext,
    ) {
        return await DeliveryBillService.getAllByCustomer(payload.customer);
    }

    @Query(() => [DeliveryBill], { description: 'For admin' })
    @Authorized([Permission.deliveryBill.list])
    public async deliveryBillsByAdmin(
        @Ctx() { payload }: GraphUserContext,
    ) {
        return await DeliveryBillService.getAll(payload.user);
    }

    @Query(() => DeliveryBill)
    @UseMiddleware(UserAuthGraph)
    public async getDeliveryBills(
        @Arg('id', () => ID) id: number
    ) {
        return await DeliveryBillService.getOne(id, {
            withDishes: true,
            withShipBy: true,
            withCustomer: true,
            withPrepareBy: true,
            withStore: true
        });
    }

    @Mutation(() => DeliveryBill, { description: 'For customer' })
    @UseMiddleware(CustomerAuthGraph)
    public async createDeliveryBill(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('addressId', () => ID) addressId: number,
        @Arg('dishIds', () => [ID]) dishIds: number[],
        @Arg('storeId', () => ID) storeId: number,
        @Arg('dishQuantities', () => [Int], { nullable: true }) dishQuantities: number[],
        @Arg('dishNotes', () => [String], { nullable: true }) dishNotes: string[],
        @Arg('discountCode', () => String, { nullable: true }) discountCode: string,
        @Arg('note', () => String, { nullable: true }) note: string,
        @Arg('voucherCode', () => String, { nullable: true }) voucherCode: string,
    ) {
        return await DeliveryBillService.createWithRestrict({
            customerUuid: payload.customer.uuid, dishIds, storeId, addressId, dishQuantities, dishNotes,
            discountCode, note, voucherCode
        });
    }

    @Mutation(() => DeliveryBill, { description: 'For customer' })
    @UseMiddleware(CustomerAuthGraph)
    public async assignCustomer(
        @Arg('id', () => ID) id: number,
        @Arg('rating', () => Float) rating: number,
        @Ctx() { payload }: GraphCustomerContext,
    ) {
        return await DeliveryBillService.rateDeliveryBill(id, { customerUuid: payload.customer.uuid, rating });
    }

    @Mutation(() => DeliveryBill, { description: 'For chef' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['chef']))
    public async prepareDeliveryBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
    ) {
        return await DeliveryBillService.prepareDeliveryBill(id, payload.user);
    }

    @Mutation(() => DeliveryBill, { description: 'For chef' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['chef']))
    public async preparedDeliveryBill(
        @Arg('id', () => ID) id: number,
        @Ctx() { payload }: GraphUserContext,
    ) {
        return await DeliveryBillService.preparedDeliveryBill(id, payload.user);
    }

    @Mutation(() => DeliveryBill, { description: 'For shipper' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['shipper']))
    public async deliveredDeliveryBillDish(
        @Arg('id', () => ID) id: number,
        @Ctx() { payload }: GraphUserContext,
    ) {
        return await DeliveryBillService.shipDeliveryBill(id, payload.user);
    }

    @Mutation(() => DeliveryBill, { description: 'For shipper' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['shipper']))
    public async collectDeliveryBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
        @Arg('collectValue', () => Float) collectValue: number,
        @Arg('note', () => String) note: string,
    ) {
        return await DeliveryBillService.collectDeliveryBill(id, payload.user, {
            collectValue, note
        });
    }

    @Mutation(() => DeliveryBill, { description: 'For admin' })
    @Authorized([Permission.deliveryBill.create])
    public async createDeliveryBillByAdmin(
        @Arg('dishIds', () => [ID]) dishIds: number[],
        @Arg('storeId', () => ID) storeId: number,
        @Arg('addressId', () => ID) addressId: number,
        @Arg('customerUuid', () => String) customerUuid: string,
        @Arg('dishQuantities', () => [Int], { nullable: true }) dishQuantities: number[],
        @Arg('discountCode', () => String, { nullable: true }) discountCode: string,
        @Arg('note', () => String, { nullable: true }) note: string,
        @Arg('voucherCode', () => String, { nullable: true }) voucherCode: string,
        @Arg('collectAt', { nullable: true }) collectAt: Date,
        @Arg('collectValue', () => Float, { nullable: true }) collectValue: number,
        @Arg('dishNotes', () => [String], { nullable: true }) dishNotes: string[],
        @Arg('createAt', { nullable: true }) createAt: Date,
        @Arg('prepareAt', { nullable: true }) prepareAt: Date,
        @Arg('preparedAt', { nullable: true }) preparedAt: Date,
        @Arg('shipAt', { nullable: true }) shipAt: Date,
        @Arg('prepareByUuid', () => String, { nullable: true }) prepareByUuid: string,
        @Arg('shipByUuid', () => String, { nullable: true }) shipByUuid: string,
        @Arg('rating', () => Float, { nullable: true }) rating: number,
    ) {
        return await DeliveryBillService.create({
            dishIds, storeId, dishQuantities, customerUuid, addressId, preparedAt, shipAt, shipByUuid,
            discountCode, note, voucherCode, collectAt, collectValue, dishNotes, prepareAt,
            prepareByUuid, rating, createAt
        });
    }

    @Mutation(() => DeliveryBill, { description: 'For admin' })
    @Authorized([Permission.deliveryBill.update])
    public async editDeliveryBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
        @Arg('addressId', () => ID) addressId: number,
        @Arg('dishIds', () => [ID]) dishIds: number[],
        @Arg('dishQuantities', () => [Int], { nullable: true }) dishQuantities: number[],
        @Arg('discountCode', () => String, { nullable: true }) discountCode: string,
        @Arg('note', () => String, { nullable: true }) note: string,
        @Arg('voucherCode', () => String, { nullable: true }) voucherCode: string,
        @Arg('collectAt', { nullable: true }) collectAt: Date,
        @Arg('collectValue', () => Float, { nullable: true }) collectValue: number,
        @Arg('dishNotes', () => [String], { nullable: true }) dishNotes: string[],
        @Arg('prepareAt', { nullable: true }) prepareAt: Date,
        @Arg('preparedAt', { nullable: true }) preparedAt: Date,
        @Arg('shipAt', { nullable: true }) shipAt: Date,
        @Arg('prepareByUuid', () => String, { nullable: true }) prepareByUuid: string,
        @Arg('shipByUuid', () => String, { nullable: true }) shipByUuid: string,
        @Arg('rating', () => Float, { nullable: true }) rating: number,
    ) {
        return await DeliveryBillService.edit(id, payload.user, {
            dishIds, dishQuantities, addressId, preparedAt, shipAt, shipByUuid,
            discountCode, note, voucherCode, collectAt, collectValue, dishNotes, prepareAt,
            prepareByUuid, rating
        });
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.deliveryBill.delete])
    public async deleteDeliveryBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number
    ) {
        await DeliveryBillService.delete(id, payload.user);

        return __('delivery_bill.delete_success');
    }
}
