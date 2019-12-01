import { Router } from 'express';
import { DishController } from '../controller/dish.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';

const router = Router();

CrudRouter(router, DishController, {
    listMiddleware: AuthorMiddleware([Permission.dish.list]),
    readMiddleware: AuthorMiddleware([Permission.dish.list]),
    createMiddleware: AuthorMiddleware([Permission.dish.create]),
    updateMiddleware: AuthorMiddleware([Permission.dish.update]),
    deleteMiddleware: AuthorMiddleware([Permission.dish.delete]),
});

export { router as DishRouter };
