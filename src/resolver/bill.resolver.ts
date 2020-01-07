import { __ } from 'i18n';
import moment from 'moment';
import { Arg, Authorized, Ctx, Float, ID, Int, Mutation, Query, UseMiddleware } from 'type-graphql';
import { Between, FindConditions } from 'typeorm';
import { Bill } from '../entity/bill';
import { DeliveryBill } from '../entity/deliveryBill';
import { Permission } from '../entity/permission';
import { onlyDate } from '../helper/onlyDate';
import { GraphUserContext } from '../lib/graphContext';
import { Authorization } from '../middleware/authorization';
import { AuthorRoleGraphMiddleware } from '../middleware/authorizationByRole';
import { UserAuthGraph } from '../middleware/userAuth';
import { BillService } from '../service/bill.service';
import { DeliveryBillService } from '../service/deliveryBill.service';
import { AllBill } from './ObjectTypes/allBill';
import { CountBill } from './ObjectTypes/countBill';

export class BillResolver {
    @Query(() => [Bill], { description: 'Get by user' })
    @UseMiddleware(UserAuthGraph)
    public async bills(
        @Ctx() { payload }: GraphUserContext,
        @Arg('storeId', () => Int, { nullable: true }) storeId: number,
        @Arg('startDay', { nullable: true }) startDay: Date,
        @Arg('endDay', { nullable: true }) endDay: Date
    ) {
        if (!Authorization(payload.user, [Permission.bill.list], false)) {
            const where: FindConditions<Bill> = {};
            if (storeId) {
                where.store = { id: storeId };
            }

            const start = onlyDate(startDay || new Date());
            const end = onlyDate(endDay || new Date());

            if (start.getTime() !== end.getTime()) {
                where.createAt = Between(start, end);
            } else {
                where.createAt = Between(start, moment(end).add(1, 'day').toDate());
            }

            return await BillService.getAll(payload.user, { where });
        }

        return await BillService.getAll(payload.user);
    }

    @Query(() => AllBill, { description: 'Get all bill today for chef' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['chef']))
    public async todayAllBillsByChef(
        @Ctx() { payload }: GraphUserContext
    ) {
        return {
            bills: await BillService.getAll(payload.user, {
                where: {
                    createAt: Between(onlyDate(new Date()), onlyDate(moment(new Date()).add(1, 'day').toDate()))
                }
            }) || [],
            deliveryBills: await DeliveryBillService.getAll(payload.user, {
                where: {
                    createAt: Between(onlyDate(new Date()), onlyDate(moment(new Date()).add(1, 'day').toDate()))
                }
            }) || []
        };
    }

    @Query(() => [Bill], { description: 'Get all bill today for staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async todayAllBillsByStaff(
        @Ctx() { payload }: GraphUserContext
    ) {
        return await BillService.getAll(payload.user, {
            where: {
                createAt: Between(onlyDate(new Date()), onlyDate(moment(new Date()).add(1, 'day').toDate()))
            }
        });
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
        @Arg('voucherCode', () => String, { nullable: true }) voucherCode: string
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
        @Arg('id', () => ID) id: number
    ) {
        return await BillService.prepareBill(id, { prepareByUuid: payload.user.uuid });
    }

    @Mutation(() => Bill, { description: 'For chef' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['chef']))
    public async preparedBillDish(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
        @Arg('dishId', () => ID) dishId: number
    ) {
        return await BillService.preparedBillDish(id, payload.user, dishId);
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async deliveredBillDish(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
        @Arg('dishId', () => ID) dishId: number
    ) {
        return await BillService.deliveredBillDish(id, payload.user, dishId);
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async collectBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number,
        @Arg('collectValue', () => Float) collectValue: number,
        @Arg('note', () => String) note: string
    ) {
        return await BillService.collectBill(id, { collectByUuid: payload.user.uuid, collectValue, note });
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async assignCustomer(
        @Arg('id', () => ID) id: number,
        @Arg('customerUuid', () => String) customerUuid: string
    ) {
        return await BillService.assignCustomer(id, { customerUuid });
    }

    @Mutation(() => Bill, { description: 'For staff' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['staff']))
    public async rateBill(
        @Arg('id', () => ID) id: number,
        @Arg('rating', () => Float) rating: number
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
        @Arg('note', () => String, { nullable: true }) note: string
    ) {
        console.log(payload);

        return await BillService.changeDishes(id, {
            updateByUuid: payload.user.uuid, dishIds, dishNotes, dishQuantities, note
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
        @Arg('rating', () => Float, { nullable: true }) rating: number
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
        @Arg('tableNumber', () => Int, { nullable: true }) tableNumber: number,
        @Arg('dishIds', () => [ID], { nullable: true }) dishIds: number[],
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
        @Arg('rating', () => Float, { nullable: true }) rating: number
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

    @Query(() => [CountBill], { description: 'For user' })
    @UseMiddleware(UserAuthGraph)
    public async countBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('storeId', () => Int, { nullable: true }) storeId: number,
        @Arg('startDay') startDay: Date,
        @Arg('endDay') endDay: Date
    ) {
        let listBill: Bill[];
        let listDBill: DeliveryBill[];
        let start = onlyDate(startDay || new Date());
        const end = onlyDate(endDay || new Date());

        if (!Authorization(payload.user, [Permission.bill.list], false)) {
            const where: FindConditions<Bill> = {};
            if (storeId) {
                where.store = { id: storeId };
            }

            if (start.getTime() !== end.getTime()) {
                where.createAt = Between(start, end);
            } else {
                where.createAt = Between(start, moment(end).add(1, 'day').toDate());
            }

            listBill = await BillService.getAll(payload.user, { where });
            listDBill = await DeliveryBillService.getAll(payload.user, { where });
        } else {
            listBill = await BillService.getAll(payload.user);
            listDBill = await DeliveryBillService.getAll(payload.user);
        }

        if ((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) > 60) {
            throw new Error(__('bill.exceeding_amount_days_is_60_days'));
        }
        if (start > end) {
            throw new Error(__('bill.start_day_must_be_less_then_end_day'));
        }

        const result = [];

        while (start <= end) {
            const count = listBill.filter(e =>
                moment(e.createAt).format('DD/MM/YYYY') === moment(start).format('DD/MM/YYYY')).length;
            const countD = listDBill.filter(e =>
                moment(e.createAt).format('DD/MM/YYYY') === moment(start).format('DD/MM/YYYY')).length;
            result.push({ day: start, count, countD });
            start = new Date(start.getTime() + 1000 * 60 * 60 * 24);
        }

        return result;
    }
}
