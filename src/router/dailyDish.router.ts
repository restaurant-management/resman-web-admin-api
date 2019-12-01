import { Router } from 'express';
import { DailyDishController } from '../controller/dailyDish.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';

const router = Router();

CrudRouter(router, DailyDishController, {
    listMiddleware: AuthorMiddleware([Permission.dailyDish.list]),
    createMiddleware: AuthorMiddleware([Permission.dailyDish.create]),
    ignore: ['read', 'update', 'delete']
});

router.get('/get_by', AuthorMiddleware([Permission.dailyDish.list]), DailyDishController.read);
router.put('/', AuthorMiddleware([Permission.dailyDish.update]), DailyDishController.update);
router.delete('/', AuthorMiddleware([Permission.dailyDish.delete]), DailyDishController.delete);

export { router as DailyDishRouter };
