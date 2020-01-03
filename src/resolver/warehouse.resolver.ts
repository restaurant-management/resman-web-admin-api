import { __ } from 'i18n';
import { Arg, Authorized, Ctx, ID, Mutation, Query, UseMiddleware } from 'type-graphql';
import { Permission } from '../entity/permission';
import { Warehouse } from '../entity/warehouse';
import { GraphUserContext } from '../lib/graphContext';
import { Authorization } from '../middleware/authorization';
import { UserAuthGraph } from '../middleware/userAuth';
import { WarehouseService } from '../service/warehouse.service';

export class WarehouseResolver {
    @Query(() => [Warehouse])
    @UseMiddleware(UserAuthGraph)
    public async warehouses(
        @Ctx() { payload }: GraphUserContext
    ) {
        return await WarehouseService.getAll({ user: payload.user });
    }

    @Query(() => Warehouse)
    @UseMiddleware(UserAuthGraph)
    public async getWarehouse(
        @Ctx() { payload }: GraphUserContext,
        @Arg('id', () => ID) id: number
    ) {
        if (payload.user.warehouses.findIndex(i => i.id === id) < 0
            && !Authorization(payload.user, [Permission.warehouse.list], false)) {
            throw new Error(__('authentication.unauthorized'));
        }
        const warehouse = await WarehouseService.getOne(id,
            { withImportBills: true, withReports: true, withStore: true });

        return warehouse;
    }

    @Mutation(() => Warehouse)
    @Authorized([Permission.warehouse.create])
    public async createWarehouse(
        @Arg('name') name: string,
        @Arg('address') address: string,
        @Arg('hotline') hotline: string,
        @Arg('description', { nullable: true }) description: string,
        @Arg('storeId', () => ID, { nullable: true }) storeId: number,
    ) {
        const warehouse = await WarehouseService.create({ address, hotline, name, description, storeId });

        return warehouse;
    }

    @Mutation(() => Warehouse)
    @Authorized([Permission.warehouse.update])
    public async editWarehouse(
        @Arg('id', () => ID) id: number,
        @Arg('name', { nullable: true }) name: string,
        @Arg('address', { nullable: true }) address: string,
        @Arg('hotline', { nullable: true }) hotline: string,
        @Arg('description', { nullable: true }) description: string,
        @Arg('storeId', () => ID, { nullable: true }) storeId: number,
    ) {
        const warehouse = await WarehouseService.edit(id, { address, hotline, name, description, storeId });

        return warehouse;
    }

    @Mutation(() => String)
    @Authorized([Permission.warehouse.delete])
    public async deleteWarehouse(
        @Arg('id', () => ID) id: number
    ) {
        await WarehouseService.delete(id);

        return __('warehouse.delete_success');
    }

    @Mutation(() => String)
    @Authorized([Permission.warehouse.delete])
    public async deleteWarehouses(
        @Arg('ids', () => [ID]) ids: number[]
    ) {
        await WarehouseService.deleteMany(ids);

        return __('warehouse.delete_success');
    }
}
