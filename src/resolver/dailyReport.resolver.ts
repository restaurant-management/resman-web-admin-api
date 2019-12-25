import { __ } from 'i18n';
import { Arg, Authorized, Ctx, ID, Int, Mutation, Query, UseMiddleware } from 'type-graphql';
import { DailyReport } from '../entity/dailyReport';
import { Permission } from '../entity/permission';
import { GraphUserContext } from '../lib/graphContext';
import { Authorization } from '../middleware/authorization';
import { UserAuthGraph } from '../middleware/userAuth';
import { DailyReportService } from '../service/dailyReport.service';

export class DailyReportResolver {
    @Query(() => [DailyReport])
    @Authorized([Permission.dailyReport.list])
    public async dailyReports() {
        return await DailyReportService.getAll();
    }

    @Query(() => DailyReport)
    @UseMiddleware(UserAuthGraph)
    public async getDailyReport(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number
    ) {
        const dailyReport = await DailyReportService.getOne(id, { withUser: true });

        if (dailyReport.user.uuid !== payload.user.uuid
            && !Authorization(payload.user, [Permission.dailyReport.list], false)) {
            throw new Error(__('authentication.unauthorized'));
        }

        return dailyReport;
    }

    @Mutation(() => DailyReport)
    @Authorized([Permission.dailyReport.create])
    public async createDailyReport(
        @Ctx() { payload }: GraphUserContext,
        @Arg('stockIds', () => [Int]) stockIds: number[],
        @Arg('quantities', () => [Int]) quantities: number[],
        @Arg('warehouseId', () => Int) warehouseId: number,
        @Arg('note', { nullable: true }) note: string,
        @Arg('stockNotes', () => [String], { nullable: true }) stockNotes: string[],
    ) {
        return await DailyReportService.create({
            quantities, stockIds, username: payload.user.username, warehouseId, note, stockNotes
        });
    }

    @Mutation(() => DailyReport)
    @Authorized([Permission.dailyReport.update])
    public async editDailyReport(
        @Arg('id', () => ID) id: number,
        @Arg('note', { nullable: true }) note: string,
    ) {
        return await DailyReportService.edit(id, { note });
    }

    @Mutation(() => String)
    @Authorized([Permission.dailyReport.delete])
    public async deleteDailyReport(
        @Arg('id', () => ID) id: number
    ) {
        await DailyReportService.delete(id);

        return __('daily_report.delete_success');
    }
}
