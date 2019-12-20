import { __ } from 'i18n';
import { Arg, Authorized, Float, ID, Mutation, Query } from 'type-graphql';
import { Comment } from '../entity/comment';
import { Dish } from '../entity/dish';
import { Permission } from '../entity/permission';
import { DishService } from '../service/dish.service';
import { CommentService } from '../service/comment.service';

export class DishResolver {
    @Query(() => [Dish], { description: 'For admin' })
    @Authorized([Permission.dish.list])
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
}
