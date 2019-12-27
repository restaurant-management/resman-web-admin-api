import { __ } from 'i18n';
import { Arg, Authorized, Ctx, ID, Mutation, Query, UseMiddleware } from 'type-graphql';
import { DailyDish, dateScalar, DaySession } from '../entity/dailyDish';
import { Permission } from '../entity/permission';
import { GraphUserContext } from '../lib/graphContext';
import { AuthorRoleGraphMiddleware } from '../middleware/authorizationByRole';
import { DailyDishService } from '../service/dailyDish.service';

export class DailyDishResolver {
    @Query(() => [DailyDish], { description: 'Public' })
    public async todayDish(
        @Arg('storeId', () => ID) storeId: number
    ) {
        return await DailyDishService.getBy({ day: new Date(), storeId });
    }

    @Query(() => [DailyDish], { description: 'For admin' })
    @Authorized([Permission.dailyDish.list])
    public async dailyDishes(
        @Arg('storeId', () => ID) storeId: number,
        @Arg('day', () => dateScalar) day: Date,
    ) {
        return await DailyDishService.getBy({ day, storeId });
    }

    @Query(() => DailyDish, { description: 'For admin' })
    @Authorized([Permission.dailyDish.list])
    public async getDailyDish(
        @Arg('storeId', () => ID) storeId: number,
        @Arg('day', () => dateScalar) day: Date,
        @Arg('session', () => DaySession) session: DaySession,
        @Arg('dishId', () => ID) dishId: number,
    ) {
        return await DailyDishService.getOne({ day, storeId, dishId, session });
    }

    @Mutation(() => [DailyDish], { description: 'For admin' })
    @Authorized([Permission.dailyDish.create])
    public async addDailyDish(
        @Arg('day', () => dateScalar) day: Date,
        @Arg('dishIds', () => [ID]) dishIds: number[],
        @Arg('storeId', () => ID) storeId: number,
        @Arg('session', () => DaySession, { nullable: true }) session: DaySession,
    ) {
        const result: DailyDish[] = [];

        for (const dishId of dishIds) {
            result.push(await DailyDishService.create({ day, dishId, storeId, session }));
        }

        return result;
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.dailyDish.delete])
    public async removeDailyDish(
        @Arg('day', () => dateScalar) day: Date,
        @Arg('dishId', () => ID) dishId: number,
        @Arg('storeId', () => ID) storeId: number,
        @Arg('session', () => DaySession, { nullable: true }) session: DaySession,
    ) {
        await DailyDishService.delete({ day, dishId, storeId, session: session || DaySession.None });

        return __('daily_dish.delete_success');
    }

    @Mutation(() => String, { description: 'For chef' })
    @UseMiddleware(AuthorRoleGraphMiddleware(['chef']))
    public async confirmOutOfStockDailyDish(
        @Ctx() { payload }: GraphUserContext,
        @Arg('dishId', () => ID) dishId: number,
        @Arg('storeId', () => ID) storeId: number,
    ) {
        await DailyDishService.confirmOut(payload.user, dishId, storeId);

        return __('daily_dish.confirm_out_of_stock_success');
    }
}
