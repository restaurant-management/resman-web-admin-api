import { Router } from 'express';
import { DishController } from '../controller/dish.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

CrudRouter(router, DishController, {
    listMiddleware: Authorization([Permission.dish.list]),
    readMiddleware: Authorization([Permission.dish.list]),
    createMiddleware: Authorization([Permission.dish.create]),
    updateMiddleware: Authorization([Permission.dish.update]),
    deleteMiddleware: Authorization([Permission.dish.delete]),
});

export { router as DishRouter };
