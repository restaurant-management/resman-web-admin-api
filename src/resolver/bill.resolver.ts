import { __ } from 'i18n';
import { Arg, Authorized, Ctx, Float, ID, Int, Mutation, Query, UseMiddleware } from 'type-graphql';
import { Bill } from '../entity/bill';
import { Permission } from '../entity/permission';
import { GraphUserContext } from '../lib/graphContext';
import { Authorization } from '../middleware/authorization';
import { AuthorRoleGraphMiddleware } from '../middleware/authorizationByRole';
import { UserAuthGraph } from '../middleware/userAuth';
import { BillService } from '../service/bill.service';

export class BillResolver {
    @Query(() => [Bill], { description: 'Get by user' })
    @UseMiddleware(UserAuthGraph)
    public async bills(
        @Ctx() { payload }: GraphUserContext,
    ) {
        if (Authorization(payload.user, [Permission.bill.list], false)) {
            return await BillService.getAll(payload.user);
        }

        return await BillService.getAllByUser(payload.user);
    }

    @Query(() => Bill)
    @UseMiddleware(UserAuthGraph)
    public async getBill(
        @Arg('id', () => ID) id: number
    ) {
        return await BillService.getOne(id, {
            withCollectBy: true,
            showDishesType: 'dishes',
            withCreateBy: true,
            withCustomer: true,
            withPrepareBy: true,
            withStore: true
        });
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async createBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('tableNumber', () => Int) tableNumber: number,
        @Arg('dishIds', () => [ID]) dishIds: number[],
        @Arg('storeId', () => ID) storeId: number,
        @Arg('dishQuantities', () => [Int], { nullable: true }) dishQuantities: number[],
        @Arg('customerUuid', () => String, { nullable: true }) customerUuid: string,
        @Arg('discountCode', () => String, { nullable: true }) discountCode: string,
        @Arg('note', () => String, { nullable: true }) note: string,
        @Arg('voucherCode', () => String, { nullable: true }) voucherCode: string,
    ) {
        return await BillService.createWithRestrict({
            createByUuid: payload.user.uuid, tableNumber, dishIds, storeId, dishQuantities, customerUuid,
            discountCode, note, voucherCode
        });
    }

    @Mutation(() => Bill, { description: 'For chef' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['chef']))
    public async prepareBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
    ) {
        return await BillService.prepareBill(id, { prepareByUuid: payload.user.uuid });
    }

    @Mutation(() => Bill, { description: 'For chef' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['chef']))
    public async preparedBillDish(
        @Arg('id', () => ID) id: number,
        @Arg('dishIds', () => ID) dishId: number,
    ) {
        return await BillService.preparedBillDish(id, dishId);
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async deliveredBillDish(
        @Arg('id', () => ID) id: number,
        @Arg('dishIds', () => ID) dishId: number,
    ) {
        return await BillService.deliveredBillDish(id, dishId);
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async collectBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
        @Arg('collectValue', () => Float) collectValue: number,
        @Arg('note', () => String) note: string,
    ) {
        return await BillService.collectBill(id, { collectByUuid: payload.user.uuid, collectValue, note });
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async assignCustomer(
        @Arg('id', () => ID) id: number,
        @Arg('customerUuid', () => String) customerUuid: string,
    ) {
        return await BillService.assignCustomer(id, { customerUuid });
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async rateBill(
        @Arg('id', () => ID) id: number,
        @Arg('rating', () => Float) rating: number,
    ) {
        return await BillService.rateBill(id, { rating });
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async changeDishesOfBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
        @Arg('dishIds', () => [ID]) dishIds: number[],
        @Arg('dishQuantities', () => [Int], { nullable: true }) dishQuantities: number[],
        @Arg('dishNotes', () => [String], { nullable: true }) dishNotes: string[],
        @Arg('note', () => String, { nullable: true }) note: string,
    ) {
        console.log(payload);

        return await BillService.changeDishes(id, {
            updateByUuid: payload.user.uuid, dishIds, dishNotes, dishQuantities, note,
        });
    }

    @Mutation(() => Bill, { description: 'For admin' })
    @Authorized([Permission.bill.create])
    public async createBillByAdmin(
        @Arg('tableNumber', () => Int) tableNumber: number,
        @Arg('dishIds', () => [ID]) dishIds: number[],
        @Arg('storeId', () => ID) storeId: number,
        @Arg('createByUuid', () => String) createByUuid: string,
        @Arg('dishQuantities', () => [Int], { nullable: true }) dishQuantities: number[],
        @Arg('customerUuid', () => String, { nullable: true }) customerUuid: string,
        @Arg('discountCode', () => String, { nullable: true }) discountCode: string,
        @Arg('note', () => String, { nullable: true }) note: string,
        @Arg('voucherCode', () => String, { nullable: true }) voucherCode: string,
        @Arg('collectByUuid', () => String, { nullable: true }) collectByUuid: string,
        @Arg('collectAt', { nullable: true }) collectAt: Date,
        @Arg('collectValue', () => Float, { nullable: true }) collectValue: number,
        @Arg('dishNotes', () => [String], { nullable: true }) dishNotes: string[],
        @Arg('createAt', { nullable: true }) createAt: Date,
        @Arg('prepareAt', { nullable: true }) prepareAt: Date,
        @Arg('prepareByUuid', () => String, { nullable: true }) prepareByUuid: string,
        @Arg('rating', () => Float, { nullable: true }) rating: number,
    ) {
        return await BillService.create({
            createByUuid, tableNumber, dishIds, storeId, dishQuantities, customerUuid,
            discountCode, note, voucherCode, collectAt, collectByUuid, collectValue, dishNotes, prepareAt,
            prepareByUuid, rating, createAt
        });
    }

    @Mutation(() => Bill, { description: 'For admin' })
    @Authorized([Permission.bill.update])
    public async editBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
        @Arg('tableNumber', () => Int) tableNumber: number,
        @Arg('dishIds', () => [ID]) dishIds: number[],
        @Arg('dishQuantities', () => [Int], { nullable: true }) dishQuantities: number[],
        @Arg('customerUuid', () => String, { nullable: true }) customerUuid: string,
        @Arg('discountCode', () => String, { nullable: true }) discountCode: string,
        @Arg('note', () => String, { nullable: true }) note: string,
        @Arg('voucherCode', () => String, { nullable: true }) voucherCode: string,
        @Arg('collectByUuid', () => String, { nullable: true }) collectByUuid: string,
        @Arg('collectAt', { nullable: true }) collectAt: Date,
        @Arg('collectValue', () => Float, { nullable: true }) collectValue: number,
        @Arg('dishNotes', () => [String], { nullable: true }) dishNotes: string[],
        @Arg('prepareAt', { nullable: true }) prepareAt: Date,
        @Arg('prepareByUuid', () => String, { nullable: true }) prepareByUuid: string,
        @Arg('rating', () => Float, { nullable: true }) rating: number,
    ) {
        return await BillService.edit(id, {
            updateByUuid: payload.user.uuid, tableNumber, dishIds, dishQuantities, customerUuid,
            discountCode, note, voucherCode, collectAt, collectByUuid, collectValue, dishNotes, prepareAt,
            prepareByUuid, rating
        });
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.bill.delete])
    public async deleteBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number
    ) {
        await BillService.delete(id, payload.user);

        return __('bill.delete_success');
    }
}
