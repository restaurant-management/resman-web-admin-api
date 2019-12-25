import { __ } from 'i18n';
import { Comment } from '../entity/comment';
import { Customer } from '../entity/customer';
import { CustomerService } from './customer.service';
import { DishService } from './dish.service';

class CommentService {
    public async getAll(dishId: number) {
        return Comment.find({ where: { dish: { id: dishId } }, relations: ['createBy', 'dish'] });
    }

    public async getOne(commentId: number, options?: { withCreateBy?: boolean, withDish?: boolean }) {
        const relations = [];
        if (options?.withCreateBy) {
            relations.push('createBy');
        }
        if (options?.withDish) {
            relations.push('dish');
        }

        const comment = await Comment.findOne(commentId, { relations });

        if (!comment) {
            throw new Error(__('comment.comment_not_found'));
        }

        return comment;
    }

    public async create(data: {
        createByUuid: string, dishId: number, content: string, rating?: number, createAt?: Date
    }) {
        const comment = new Comment();

        comment.createBy = await CustomerService.getOne({ uuid: data.createByUuid });
        comment.dish = await DishService.getOne(data.dishId);
        comment.createAt = data.createAt || new Date();
        comment.content = data.content;
        comment.rating = data.rating;

        await comment.save();

        return await this.getOne(comment.id, { withCreateBy: true, withDish: true });
    }

    public async createWithRestrict(data: { createBy: Customer, dishId: number, content: string, rating?: number }) {
        return await this.create({ ...data, createByUuid: data.createBy.uuid });
    }

    public async delete(id: number) {
        const comment = await this.getOne(id);

        try {
            await comment.remove();
        } catch (e) {
            console.log(e);

            throw new Error(__('comment.delete_failed'));
        }
    }
}

const commentService = new CommentService();

export { commentService as CommentService };
