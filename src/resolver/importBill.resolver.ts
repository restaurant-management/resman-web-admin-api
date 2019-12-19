import { __ } from 'i18n';
import { Arg, Authorized, Ctx, Float, ID, Int, Mutation, Query, UseMiddleware } from 'type-graphql';
import { ImportBill } from '../entity/importBill';
import { Permission } from '../entity/permission';
import { GraphUserContext } from '../lib/graphContext';
import { Authorization } from '../middleware/authorization';
import { UserAuthGraph } from '../middleware/userAuth';
import { ImportBillService } from '../service/importBill.service';

export class ImportBillResolver {
    @Query(() => [ImportBill])
    @Authorized([Permission.importBill.list])
    public async importBills() {
        return await ImportBillService.getAll();
    }

    @Query(() => ImportBill)
    @UseMiddleware(UserAuthGraph)
    public async getImportBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number
    ) {
        const importBill = await ImportBillService.getOne(id, { withUser: true });

        if (importBill.user.uuid !== payload.user.uuid
            && !Authorization(payload.user, [Permission.importBill.list], false)) {
            throw new Error(__('authentication.unauthorized'));
        }

        return importBill;
    }

    @Mutation(() => ImportBill)
    @Authorized([Permission.importBill.create])
    public async createImportBill(
        @Ctx() { payload }: GraphUserContext,
        @Arg('stockIds', () => [Int]) stockIds: number[],
        @Arg('quantities', () => [Int]) quantities: number[],
        @Arg('warehouseId', () => Int) warehouseId: number,
        @Arg('note', { nullable: true }) note: string,
        @Arg('stockNotes', () => [String], { nullable: true }) stockNotes: string[],
        @Arg('stockPrices', () => [Float], { nullable: true }) stockPrices: number[],
    ) {
        return await ImportBillService.create({
            quantities, stockIds, username: payload.user.username, warehouseId, note, stockNotes, stockPrices
        });
    }

    @Mutation(() => ImportBill)
    @Authorized([Permission.importBill.update])
    public async editImportBill(
        @Arg('id', () => ID) id: number,
        @Arg('note', { nullable: true }) note: string,
    ) {
        return await ImportBillService.edit(id, { note });
    }

    @Mutation(() => String)
    @Authorized([Permission.importBill.delete])
    public async deleteImportBill(
        @Arg('id', () => ID) id: number
    ) {
        await ImportBillService.delete(id);

        return __('import_bill.delete_success');
    }
}
