import { __ } from 'i18n';
import { Arg, Authorized, Ctx, Float, ID, Mutation, Query, UseMiddleware } from 'type-graphql';
import { Dish } from '../entity/dish';
import { Permission } from '../entity/permission';
import { GraphCustomerContext } from '../lib/graphContext';
import { CustomerAuthGraph } from '../middleware/customerAuth';
import { UserAuthGraph } from '../middleware/userAuth';
import { DishService } from '../service/dish.service';

export class DishResolver {
    @Query(() => [Dish], { description: 'For all user' })
    @UseMiddleware(UserAuthGraph)
    public async dishes() {
        return await DishService.getAll({});
    }

    @Query(() => Dish, { description: 'For admin' })
    @Authorized([Permission.dish.list])
    public async getDish(
        @Arg('id', () => ID) id: number
    ) {
        return await DishService.getOne(id);
    }

    @Mutation(() => Dish, { description: 'For admin' })
    @Authorized([Permission.dish.create])
    public async createDish(
        @Arg('name') name: string,
        @Arg('defaultPrice', () => Float, { nullable: true }) defaultPrice: number,
        @Arg('description', { nullable: true }) description: string,
        @Arg('images', () => [String], { nullable: true }) images: string[],
    ) {
        return await DishService.create({ name, defaultPrice, description, images });
    }

    @Mutation(() => Dish, { description: 'For admin' })
    @Authorized([Permission.dish.update])
    public async editDish(
        @Arg('id', () => ID) id: number,
        @Arg('name', { nullable: true }) name: string,
        @Arg('defaultPrice', () => Float, { nullable: true }) defaultPrice: number,
        @Arg('description', { nullable: true }) description: string,
        @Arg('images', () => [String], { nullable: true }) images: string[],
    ) {
        return await DishService.edit(id, { name, defaultPrice, description, images });
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.dish.delete])
    public async deleteDish(
        @Arg('id', () => ID) id: number,
    ) {
        await DishService.delete(id);

        return __('dish.delete_success');
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.dish.delete])
    public async deleteDishes(
        @Arg('ids', () => [ID]) ids: number[],
    ) {
        await DishService.deleteMany(ids);

        return __('dish.delete_success');
    }

    @Mutation(() => String, { description: 'For customer' })
    @UseMiddleware(CustomerAuthGraph)
    public async favouriteDish(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('id', () => ID) id: number,
    ) {
        await DishService.favouriteDish(id, payload.customer.uuid);

        return __('dish.favourite_success');
    }

    @Mutation(() => String, { description: 'For customer' })
    @UseMiddleware(CustomerAuthGraph)
    public async unFavouriteDish(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('id', () => ID) id: number,
    ) {
        await DishService.unFavouriteDish(id, payload.customer.uuid);

        return __('dish.un_favourite_success');
    }
}
