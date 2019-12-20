import { __ } from 'i18n';
import { Arg, Authorized, Ctx, Float, ID, Mutation, Query, UseMiddleware } from 'type-graphql';
import { Comment } from '../entity/comment';
import { Permission } from '../entity/permission';
import { GraphCustomerContext } from '../lib/graphContext';
import { CustomerAuthGraph } from '../middleware/customerAuth';
import { CommentService } from '../service/comment.service';

export class CommentResolver {
    @Query(() => [Comment], { description: 'Public' })
    public async dishComments(
        @Arg('dishId', () => ID) dishId: number
    ) {
        return await CommentService.getAll(dishId);
    }

    @Query(() => Comment, { description: 'Public' })
    public async getDishComment(
        @Arg('id', () => ID) id: number
    ) {
        return await CommentService.getOne(id, { withCreateBy: true, withDish: true });
    }

    @Mutation(() => Comment, { description: 'For customer' })
    @UseMiddleware(CustomerAuthGraph)
    public async createComment(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('content') content: string,
        @Arg('dishId', () => ID) dishId: number,
        @Arg('rating', () => Float, { nullable: true }) rating: number,
    ) {
        return await CommentService.createWithRestrict({
            createBy: payload.customer, content, dishId, rating
        });
    }

    @Mutation(() => Comment, { description: 'For admin' })
    @Authorized([Permission.comment.create])
    public async createCommentByAdmin(
        @Arg('createByUuid') createByUuid: string,
        @Arg('content') content: string,
        @Arg('dishId', () => ID) dishId: number,
        @Arg('rating', () => Float, { nullable: true }) rating: number,
        @Arg('createAt', { nullable: true }) createAt: Date,
    ) {
        return await CommentService.create({
            createByUuid, content, dishId, rating, createAt
        });
    }

    @Mutation(() => String, { description: 'For customer' })
    @UseMiddleware(CustomerAuthGraph)
    public async deleteComment(
        @Ctx() { payload }: GraphCustomerContext,
        @Arg('id', () => ID) id: number
    ) {
        const comment = await CommentService.getOne(id, { withCreateBy: true });
        if (comment.createBy.uuid !== payload.customer.uuid) {
            throw new Error(__('authentication.unauthorized'));
        }

        try {
            await CommentService.delete(id);
        } catch (e) {
            console.log(e);

            return __('comment.delete_failed');
        }

        return __('comment.delete_success');
    }

    @Mutation(() => String, { description: 'For customer' })
    @Authorized([Permission.comment.delete])
    public async deleteCommentByAdmin(
        @Arg('id', () => ID) id: number
    ) {
        await CommentService.delete(id);

        return __('comment.delete_success');
    }
}
